const express = require("express");
const connectDB = require("./lib/db");
const cors = require("cors");
const PORT = 3000;
const app = express();
const db = require("./models");
const authRoutes = require("./routes/(auth)/authRoutes");
const uploadRoute = require("./routes/upload");
const userRoute = require("./routes/user");
connectDB();
// Middleware to parse JSON
app.use(express.json());
app.use(
  cors({
    origin: true, // Allows all domains
    credentials: true, // Allow cookies to be sent with requests
  }),
);

app.get("/", (req, res) => {
  res.send("Basic Route Called");
});

app.use("/upload", uploadRoute);
app.use("/api/auth", authRoutes);
app.use("/users", userRoute);

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
