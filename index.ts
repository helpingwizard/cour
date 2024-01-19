import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import adminRouter from "./routes/admin";
//import userRouter from "./routes/user";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/admin", adminRouter)
//app.use("/user", userRouter)
app.get("/", (req, res) => res.json({ msg: "hello world after the class" }));

// Connect to MongoDB
// DONT MISUSE THIS THANKYOU!!
mongoose.connect('mongodb+srv://vctanish7:gargichar123@cosmoscluster.hhjchno.mongodb.net/courses', { dbName: "courses" });

app.listen(3000, () => console.log('Server running on port 3000'));
