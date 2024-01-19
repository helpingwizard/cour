import mongoose from "mongoose";
import express from 'express';
import { User, Course, Admin } from "../db";
import jwt from 'jsonwebtoken';
import { SECRET } from "../middleware/auth";
import { authenticateJwt } from "../middleware/auth";

const router = express.Router();

router.get('/me', authenticateJwt, async (req,res) => {
  const userId = req.headers["userId"];
  const admin = await Admin.findOne({_id: userId });
  if (admin) {
    res.json({ username: admin.username });
  }else{
    res.status(403).json({ message: 'User not logged in' });
  }


});

router.post('/signup',async (req, res) => {
  const {username, password} = req.body;
  const admin = await Admin.findOne({username});
  if (!admin) {
    const newAdmin = new Admin({username, password});
    newAdmin.save();
    const token = jwt.sign({id: newAdmin._id, role: 'admin'}, SECRET, { expiresIn: '1h' });
    res.status(203).json({mesagge: "admin successfully created", token})
  }
  else{
    res.status(402).json({message: "Admin already exists"});
  }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username, password });
    if (admin) {
        const token = jwt.sign({ id: admin._id, role: 'admin' }, SECRET, { expiresIn: '1h' });
        res.json({ message: 'Logged in successfully', token });
    } else {
        res.status(403).json({ message: 'Invalid username or password' });
    }
});


interface createCourse {
  title: String,
  description : String,
  price : Number,
  imageLink : String
}

router.post('/courses', authenticateJwt, async (req, res) => {
    const userId = req.headers["userId"];
    const inputCourse  :  createCourse = req.body;
    const course = new Course({title: inputCourse.title, price: inputCourse.price, imageLink: inputCourse.imageLink, description: inputCourse.description, userId});
    await course.save();
    res.json({ message: 'Course created successfully', courseId: course.id });
});

router.put('/courses/:courseId', authenticateJwt, async (req, res) => {
    const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
    if (course) {
        res.json({ message: 'Course updated successfully' });
    } else {
        res.status(404).json({ message: 'Course not found' });
    }
});

router.get('/courses', authenticateJwt, async (req, res) => {
    const userId = req.headers["userId"];
    const courses = await Course.find({userId});
    res.json({ courses });
});

router.get('/course/:courseId', authenticateJwt, async (req, res) => {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    res.json({ course });
});

export default router;
