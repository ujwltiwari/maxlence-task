const express = require("express");
const connectDB = require("./lib/db");
const cors = require("cors");
const PORT = 3000;
const app = express();
const db = require("./models");

connectDB();
// Middleware to parse JSON
app.use(express.json());
app.use(cors());
const loginRoute = require("./routes/(auth)/login");
const signUpRoute = require("./routes/(auth)/signup");
const uploadRoute = require("./routes/upload");

app.get("/", (req, res) => {
  res.send("Basic Route Called");
});

app.use("/login", loginRoute);
app.use("/signup", signUpRoute);
app.use("/upload", uploadRoute);
db.sequelize
  .sync()
  // .sync({ force: true }) // remove force: true after table changes
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is started at: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error syncing with the database:", err);
  });
