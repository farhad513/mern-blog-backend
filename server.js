const express = require("express");
const database = require("./config/db");
const errorMiddleware = require("./middleware/error");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
require("dotenv").config();
const port = process.env.PORT;
app.use(
  cors({
    origin:
      process.env.MODE === "pro"
        ? [process.env.client_customer_pro_url]
        : ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use("/api", require("./routes/authRoute"));
app.use("/api", require("./routes/userRoute"));
app.use("/api", require("./routes/postRoute"));
app.use("/api/comment", require("./routes/commentRoute"));
// app.use(errorMiddleware);
// databasr configuration
database();
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
