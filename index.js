const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const PORT = process.env.PORT || 4000;
const fileUpload = require("express-fileupload");

const authRoutes = require("./routes/auth");
const tpoRoutes = require("./routes/tpo");
const openRoutes = require("./routes/open");
const studentRoutes = require("./routes/student");
const jobRoutes = require("./routes/job");
const alumniRoutes = require("./routes/alumni");
const statisticsRoute = require("./routes/statistics");
const recruiterRoute = require("./routes/recruiter");
const tnpOfficer = require("./routes/tnpOfficer");
const { dbConnect } = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");

dotenv.config();
dbConnect();
cloudinaryConnect();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "https://tpo-beta.vercel.app" 
      // "http://localhost:3000",
    ], 
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Testing the server
app.get("/", (req, res) => {
  return res.json({
    message: "Server is up and running ...",
    success: true,
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/auth/alumni", alumniRoutes);
app.use("/api/v1/tpo", tpoRoutes);
app.use("/api/v1/student", studentRoutes);
app.use("/api/v1", openRoutes);
app.use("/api/v1/job", jobRoutes);
app.use("/api/v1/stats", statisticsRoute);
app.use("/api/v1/recruiter", recruiterRoute);
app.use("/api/v1/tnpOfficer", tnpOfficer);

// Listening to the server
app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
});
