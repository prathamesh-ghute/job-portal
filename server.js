require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { body, param, validationResult } = require('express-validator');
const connectDB = require('./src/config/db');
const User = require('./src/models/User');
const Job = require('./src/models/Job');
const Application = require('./src/models/Application');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'https://fresherjobs.vercel.app',
    'https://*.vercel.app'
].filter(Boolean); // Remove any undefined values

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.some(allowedOrigin => {
            if (allowedOrigin.includes('*')) {
                // Handle wildcard domains
                const regex = new RegExp('^' + allowedOrigin.replace('*', '.*') + '$');
                return regex.test(origin);
            }
            return allowedOrigin === origin;
        })) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });
}

// Validation middleware
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Auth middleware
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            throw new Error();
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate.' });
    }
};

// Admin middleware
const adminAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || user.role !== 'admin') {
            throw new Error();
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Admin access required.' });
    }
};

// Auth Routes
app.post('/api/auth/register', [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/\d/)
        .withMessage('Password must contain a number'),
    validate
], async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });

        res.status(201).json({
            success: true,
            message: 'Registration successful'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/auth/login', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
], async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// User Routes
app.get('/api/users', adminAuth, async (req, res) => {
    try {
        const users = await User.find()
            .select('name email role createdAt')
            .lean();

        const sanitizedUsers = users.map(user => ({
            id: user._id,
            name: user.name,
            role: user.role,
            joinedAt: user.createdAt
        }));

        res.json(sanitizedUsers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/users/:id', [
    param('id').isMongoId().withMessage('Invalid user ID'),
    validate
], auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('name role createdAt')
            .lean();

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const sanitizedUser = {
            id: user._id,
            name: user.name,
            role: user.role,
            joinedAt: user.createdAt
        };

        res.json(sanitizedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/users/:id', [
    param('id').isMongoId().withMessage('Invalid user ID'),
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Please enter a valid email'),
    validate
], auth, async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized' });
        }

        user.name = name || user.name;
        user.email = email || user.email;

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/users/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password')
            .populate('postedJobs', 'title company location type createdAt')
            .lean();
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Job Routes
app.get('/api/jobs', auth, async (req, res) => {
    try {
        const jobs = await Job.find().populate('postedBy', 'name email');
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/jobs/:id', [
    param('id').isMongoId().withMessage('Invalid job ID'),
    validate
], auth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('postedBy', 'name email');
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.json(job);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/jobs/user', auth, async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: req.user._id })
            .sort({ createdAt: -1 })
            .populate('applications', 'status')
            .lean();
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/jobs', [
    body('title').trim().notEmpty().withMessage('Job title is required'),
    body('company').trim().notEmpty().withMessage('Company name is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('requirements').isArray().withMessage('Requirements must be an array'),
    body('salary').trim().notEmpty().withMessage('Salary is required'),
    body('type').isIn(['Full-time', 'Part-time', 'Contract', 'Internship']).withMessage('Invalid job type'),
    validate
], auth, async (req, res) => {
    try {
        // Create the job
        const job = await Job.create({
            ...req.body,
            postedBy: req.user._id
        });

        // Update the user's posted jobs
        await User.findByIdAndUpdate(
            req.user._id,
            { $push: { postedJobs: job._id } }
        );

        // Populate the job with user details before sending response
        const populatedJob = await Job.findById(job._id)
            .populate('postedBy', 'name email')
            .lean();

        res.status(201).json(populatedJob);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/jobs/:id', [
    param('id').isMongoId().withMessage('Invalid job ID'),
    body('title').optional().trim().notEmpty().withMessage('Job title cannot be empty'),
    body('company').optional().trim().notEmpty().withMessage('Company name cannot be empty'),
    body('location').optional().trim().notEmpty().withMessage('Location cannot be empty'),
    body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
    body('requirements').optional().isArray().withMessage('Requirements must be an array'),
    body('salary').optional().isNumeric().withMessage('Salary must be a number'),
    body('type').optional().isIn(['Full-time', 'Part-time', 'Contract', 'Internship']).withMessage('Invalid job type'),
    validate
], auth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('postedBy', 'name email');

        res.json(updatedJob);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/jobs/:id', [
    param('id').isMongoId().withMessage('Invalid job ID'),
    validate
], auth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized' });
        }

        await job.remove();
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Application Routes
app.get('/api/applications', adminAuth, async (req, res) => {
    try {
        const applications = await Application.find()
            .populate('user', 'name')
            .populate('job', 'title company')
            .lean();

        const sanitizedApplications = applications.map(app => ({
            id: app._id,
            jobTitle: app.job.title,
            company: app.job.company,
            applicantName: app.user.name,
            status: app.status,
            appliedAt: app.createdAt
        }));

        res.json(sanitizedApplications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/applications/user', auth, async (req, res) => {
    try {
        const applications = await Application.find({ user: req.user._id })
            .populate('job', 'title company');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/applications', [
    body('jobId').isMongoId().withMessage('Invalid job ID'),
    body('resume').trim().notEmpty().withMessage('Resume is required'),
    body('coverLetter').trim().notEmpty().withMessage('Cover letter is required'),
    validate
], auth, async (req, res) => {
    try {
        const { jobId, resume, coverLetter } = req.body;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        const existingApplication = await Application.findOne({
            user: req.user._id,
            job: jobId
        });

        if (existingApplication) {
            return res.status(400).json({ error: 'Already applied for this job' });
        }

        const application = await Application.create({
            user: req.user._id,
            job: jobId,
            resume,
            coverLetter
        });

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/applications/:id/status', [
    param('id').isMongoId().withMessage('Invalid application ID'),
    body('status').isIn(['pending', 'reviewed', 'accepted', 'rejected']).withMessage('Invalid status'),
    validate
], adminAuth, async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        application.status = status;
        await application.save();

        res.json(application);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Statistics Route
app.get('/api/stats', adminAuth, async (req, res) => {
    try {
        const [
            totalUsers,
            totalJobs,
            totalApplications,
            applicationsByStatus
        ] = await Promise.all([
            User.countDocuments(),
            Job.countDocuments(),
            Application.countDocuments(),
            Application.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ])
        ]);

        res.json({
            totalUsers,
            totalJobs,
            totalApplications,
            applicationsByStatus
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        const dbState = mongoose.connection.readyState;
        const healthStatus = {
            status: dbState === 1 ? 'healthy' : 'unhealthy',
            database: dbState === 1 ? 'connected' : 'disconnected',
            timestamp: new Date().toISOString()
        };

        res.status(dbState === 1 ? 200 : 503).json(healthStatus);
    } catch (error) {
        res.status(503).json({
            status: 'unhealthy',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
}); 