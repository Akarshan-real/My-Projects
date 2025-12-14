// script.js
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { config } from 'dotenv'
import router from './routes/todoRoutes.js';

config();

const app = express();

app.use(cors());
app.set('view engine','ejs');
app.use(express.json());

const port = process.env.PORT || 3000;

app.get('/', (req,res)=>{
  res.render('index');
});

const checkApiKeyMiddleware = (req,res,next) => {
  if (req.method === 'OPTIONS') {
    return next();  
  }
  const incomingApiKey =req.headers['frontend-api'];
  const ourApiKey = process.env.API;
  if (incomingApiKey === ourApiKey) {
    next();
  }
  else {
    res.status(403).json({msg:"Wrong api key sent"});
    console.log("Wrong api dude") ;
  }
}

app.use("/api", checkApiKeyMiddleware ,  router);

(async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`db connected by mongoose with atlas`);

    app.listen(port, () => {
      console.log(`port running`," ", port);
    });
  }
  catch (error) {
    console.log('Database failed to connect'," ", error.message);
    process.exit(1);
  }
})();
