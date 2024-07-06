import app from './app';
import AppDataSource from './config/databaseConfig';

const PORT = process.env.SERVER_PORT || 5000;

AppDataSource.initialize()
  .then(() => {
    console.log('Database has been initialized!');

    // Start your Express server after the DB connection is established
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
