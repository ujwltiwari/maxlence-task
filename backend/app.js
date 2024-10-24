import express from "express";
import connectDB from "./lib/db.js";
import sequelizeCon from "./seqeulize/sequlizeConn.js";
import cors from "cors";
import loginRoute from "./routes/(auth)/login.js";
import signUpRoute from "./routes/(auth)/signup.js";
import uploadRoute from "./routes/upload.js";

const PORT = 3000;
const app = express();
connectDB();
sequelizeCon();
// Middleware to parse JSON
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Basic Route Called");
});

app.use("/login", loginRoute);
app.use("/signup", signUpRoute);
app.use("/upload", uploadRoute);

app.listen(PORT, () => {
  console.log(`Server is Started At: ${PORT}`);
});
