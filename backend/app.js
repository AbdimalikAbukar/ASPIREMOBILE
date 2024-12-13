const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:8081",
  })
);

app.use(
  session({
    secret: "my-very-simple-session-secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(flash());

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  });

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", require("./routes/indexRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/goals", require("./routes/goalRoutes"));
app.use("/api/friends", require("./routes/friendRoutes"));

// Server
app.listen(PORT, () => console.log(`Server running on localhost:${PORT}`));
