import app from './app';
import AppDataSource from './config/databaseConfig';

const PORT = process.env.SERVER_PORT || 5000;

// Start your Express server after the DB connection is established
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

AppDataSource.initialize()
  .then(() => {
    console.log('Database has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
