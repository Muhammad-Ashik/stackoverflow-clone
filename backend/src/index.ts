import app from "./app";
import { sequelize } from "./database/database";

const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await sequelize
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");
    })
    .catch((error) => {
      console.error("Unable to connect to the database:", error);
    });
});
