import express from 'express';
import mongoose from 'mongoose';
import { DATABASE_URI } from './config';
import router from './routes';
import cors from 'cors';
const app = express();
const port = 8000
const whitelist = ["http://localhost:3000"]
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

mongoose.connect(DATABASE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => app.listen(port, () => console.log('listen on port 8000.'))).catch((error) => console.log("error occured", error))