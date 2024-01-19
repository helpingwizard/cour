"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const admin_1 = __importDefault(require("./routes/admin"));
//import userRouter from "./routes/user";
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/admin", admin_1.default);
//app.use("/user", userRouter)
app.get("/", (req, res) => res.json({ msg: "hello world after the class" }));
// Connect to MongoDB
// DONT MISUSE THIS THANKYOU!!
mongoose_1.default.connect('mongodb+srv://vctanish7:gargichar123@cosmoscluster.hhjchno.mongodb.net/courses', { dbName: "courses" });
app.listen(3000, () => console.log('Server running on port 3000'));
