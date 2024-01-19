"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../middleware/auth");
const auth_2 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/me', auth_2.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.headers["userId"];
    const admin = yield db_1.Admin.findOne({ _id: userId });
    if (admin) {
        res.json({ username: admin.username });
    }
    else {
        res.status(403).json({ message: 'User not logged in' });
    }
}));
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const admin = yield db_1.Admin.findOne({ username });
    if (!admin) {
        const newAdmin = new db_1.Admin({ username, password });
        newAdmin.save();
        const token = jsonwebtoken_1.default.sign({ id: newAdmin._id, role: 'admin' }, auth_1.SECRET, { expiresIn: '1h' });
        res.status(203).json({ mesagge: "admin successfully created", token });
    }
    else {
        res.status(402).json({ message: "Admin already exists" });
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const admin = yield db_1.Admin.findOne({ username, password });
    if (admin) {
        const token = jsonwebtoken_1.default.sign({ id: admin._id, role: 'admin' }, auth_1.SECRET, { expiresIn: '1h' });
        res.json({ message: 'Logged in successfully', token });
    }
    else {
        res.status(403).json({ message: 'Invalid username or password' });
    }
}));
router.post('/courses', auth_2.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.headers["userId"];
    const inputCourse = req.body;
    const course = new db_1.Course({ title: inputCourse.title, price: inputCourse.price, imageLink: inputCourse.imageLink, description: inputCourse.description, userId });
    yield course.save();
    res.json({ message: 'Course created successfully', courseId: course.id });
}));
router.put('/courses/:courseId', auth_2.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield db_1.Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
    if (course) {
        res.json({ message: 'Course updated successfully' });
    }
    else {
        res.status(404).json({ message: 'Course not found' });
    }
}));
router.get('/courses', auth_2.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.headers["userId"];
    const courses = yield db_1.Course.find({ userId });
    res.json({ courses });
}));
router.get('/course/:courseId', auth_2.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courseId = req.params.courseId;
    const course = yield db_1.Course.findById(courseId);
    res.json({ course });
}));
exports.default = router;
