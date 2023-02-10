const express = require("express");
const mongoose = require("mongoose");
const { DATABASE_URI } = require('./config');
const router = require('./routes');
const cors = require("cors");
const app = express();
const port = 8000
const whitelist = ["http://localhost:3000", "https://hrmsapp.vercel.app"]
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}
app.use(cors(corsOptions))

app.use(express.json());
app.use('/', router);
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }))

mongoose.set("strictQuery", false);
mongoose.connect(DATABASE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
}).then(() => app.listen(port, () => console.log('listen on port 8000.'))).catch((error) => console.log("error occured", error))


