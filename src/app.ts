import express, { Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import R1 from './routes/route1';
import userRoute from './routes/user';
import cors from 'cors'; 
const router = express();

const app = express();
const bodyParser = require('body-parser');
/** Parse the body of the request */
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json()); 
app.use(cors()); 

mongoose.connect('mongodb://localhost/cleanEnergy', {
/*   useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false, */
},()=>{}) 
app.use(json());


/** Routes go here */
app.use('/role', R1);
app.use('/user', userRoute);

/** Error handling */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message });
}); 
app.listen(3000,()=>{
  console.log("Server started")
})