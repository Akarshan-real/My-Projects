import express from 'express';
import getRoute from "./GET/route.js";
import postRoute from "./POST/route.js";

const router = express.Router();

router.use(getRoute);
router.use(postRoute);

export default router;