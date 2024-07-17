import app from './app';
import AppDataSource from './config/databaseConfig';

const PORT = process.env.BACKEND_PORT || 4000;

// Start your Express server after the DB connection is established
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Server is using ${process.env.NODE_ENV} environment`);
});

AppDataSource.initialize()
  .then(async () => {
    console.log('Database has been initialized!');
    await AppDataSource.dropDatabase().then(() => {
      console.log('Database has been dropped');
    });
    await AppDataSource.runMigrations()
      .then(() => {
        console.log('Database migrations have been run!');
      })
      .catch((err) => {
        console.error('Error during Data Source migration:', err);
      });
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
