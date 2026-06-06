import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { config } from 'dotenv';
import router from './routes/index.js';

config();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://www.shini.xyz",
    "https://landing-1-git-main-akarshans-projects-37ce71d8.vercel.app",
    "https://landing-1-c9ra2j23n-akarshans-projects-37ce71d8.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.set('view engine', 'ejs');
app.use(express.json());

const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.render('index');
});

app.get('/ping', async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db?.admin().ping();

      res.status(200).json({
        status: 'ok',
        message: 'pong - db active'
      });
    } else {
      res.status(503).json({
        status: 'error',
        message: 'db disconnected'
      });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'ping failed' });
  }
});

const checkApiKeyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  const incomingApiKey = req.headers['frontend-api'];
  const ourApiKey = process.env.API;
  if (incomingApiKey === ourApiKey) {
    next();
  }
  else {
    console.warn("Unauthorized API access attempt");
    return res.status(403).json({ msg: "Wrong api key sent" });
  }
}

app.use("/api", checkApiKeyMiddleware, router);

(async function startServer() {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL not defined");
    }
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`db connected by mongoose with atlas`);

    app.listen(port, () => {
      console.log(`port running`, " ", port);
    });
  }
  catch (error: any) {
    console.log('Database failed to connect', " ", error.message);
    process.exit(1);
  }
})();
