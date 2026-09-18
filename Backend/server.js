require("dotenv").config();
const app = require("./src/app.js");
const connectDB = require("./src/db/db.js");

app.listen(3000, () => {

  console.log("Server is Running on Port 3000");
  connectDB();
});
