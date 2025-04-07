const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Using the default MongoDB installation path for Windows
        const conn = await mongoose.connect('mongodb://127.0.0.1:27017/jobportal', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        console.log('Please make sure MongoDB is installed and running as a service');
        process.exit(1);
    }
};

module.exports = connectDB; 