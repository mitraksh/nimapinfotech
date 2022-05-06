const dotenv = require('dotenv');
const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const morgan = require('morgan');

const categoryRouter = require('./routes/categoryRoutes');
const productRouter = require('./routes/productRoutes');
const AppError = require('./utilities/appError');
const globalErrorHandler = require('./controllers/errorControllers');

// PREOCESS.ENV CONFIGURATION
dotenv.config({ path: './config.env' });
// console.log(process.env.NODE_ENV);

// EXPRESS APP
const app = express();

// To enable and trust proxy
app.enable('trust proxy');

// GLOBAL MIDDLEWARES
// To implement CORS
app.use(cors());

// To respond to options preflight by browser for non-simple requests
app.options('*', cors());

// For security http headers
app.use(helmet());

// For limiting requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP! Please try again after 60 minutes',
});
app.use('/api', limiter);

// For reading data into req.body from req and for also to set payload limit to 10kb
app.use(express.json({ limit: '10kb' }));

// For data sanitization against NoSQL query injection
app.use(mongoSanitize());

// For data sanitization against XSS (Cross Site Attack)
app.use(xss());

// To prevent HTTP parameter pollution
app.use(
  hpp({
    whitelist: ['category', 'product'],
  })
);

// For develeopment env logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ROUTES
app.use('/api/v1/categories', categoryRouter);

app.all('*', (req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server`, 404)
  );
});

// GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;
