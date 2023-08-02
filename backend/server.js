const express = require("express");
const env = require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");
const connectDB = require("./config/dbConnection");
const cors = require('cors');

const app = express();
app.use(cors());
connectDB();
const port = process.env.PORT || 5000;


app.use(express.static("../frontend"));

// Parse JSON bodies
app.use(express.json());

// Other routes and middleware go here
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// Error handling middleware
app.use(errorHandler);


app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
