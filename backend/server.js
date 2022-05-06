const mongoose = require('mongoose');

const app = require('./app');

// REGISTERING EVENT FOR UNCAUGHT EXCEPTION (ERROR IN SYNC)
process.on('uncaughtException', (err) => {
  console.log(`UNCAUGHT EXCEPTION! 💥 Shutting down...`);
  console.log(`Error name - ${err.name}`);
  console.log(`Error message - ${err.message}`);
  process.exit(1);
});

mongoose
  .connect(process.env.DATABASE_LOCAL)
  .then(() => console.log('Database connected'))
  .catch((err) => console.log(`Database connection error : ${err}`));

// STARTING SERVER
const port = parseInt(process.env.PORT, 10);
const server = app.listen(port, () => {
  console.log(`App listening to port ${port}...`);
});

// REGISTERING EVENT FOR UNHANDLED REJECTIONS (ERROR IN ASYNC)
process.on('unhandledRejection', (err) => {
  console.log(`UNHANDLED REJECTION! 💥 Shutting down...`);
  console.log(`Error name - ${err.name}`);
  console.log(`Error message - ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
