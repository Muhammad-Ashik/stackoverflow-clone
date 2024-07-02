import app from "./app";
import AppDataSource from "./config/database";

const PORT = 4000;

// Start the server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  // to initialize the initial connection with the database, register all entities
  // and "synchronize" database schema, call "initialize()" method of a newly created database
  // once in your application bootstrap
  AppDataSource.initialize()
    .then(() => {
      console.log("Database connected!");
    })
    .catch((error) => console.log(error));
});
