# Job Portal for Freshers

A modern job portal application built with React, designed specifically for fresh graduates to find their dream jobs.

## Features

- Browse and search for jobs
- Detailed job listings
- Job application system
- Responsive design
- Modern UI with Tailwind CSS

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd job-portal-freshers
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── pages/         # Page components
  ├── App.js         # Main application component
  ├── index.js       # Application entry point
  └── index.css      # Global styles
```

## API Integration

The application uses a mock API endpoint. To integrate with a real backend:

1. Update the API endpoints in the following files:
   - `src/pages/JobListings.js`
   - `src/pages/JobDetails.js`
   - `src/pages/ApplyJob.js`

2. Replace `https://api.example.com` with your actual API endpoint.

## Technologies Used

- React
- React Router
- Axios
- Tailwind CSS
- HTML5
- CSS3

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 