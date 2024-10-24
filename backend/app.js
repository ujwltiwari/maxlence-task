const express = require("express");
const connectDB = require("./lib/db");
const cors = require("cors");
const PORT = 3000;
const app = express();
const db = require("./models");
const authRoutes = require("./routes/(auth)/authRoutes");
connectDB();
// Middleware to parse JSON
app.use(express.json());
app.use(cors());
// const loginRoute = require("./routes/(auth)/login2");
// const signUpRoute = require("./routes/(auth)/signup");
const uploadRoute = require("./routes/upload");
// const authRoute = require("./routes/(auth)/auth");

app.get("/", (req, res) => {
  res.send("Basic Route Called");
});

// app.use("/login", loginRoute);
// app.use("/signup", signUpRoute);
app.use("/upload", uploadRoute);
app.use("/api/auth", authRoutes);

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
