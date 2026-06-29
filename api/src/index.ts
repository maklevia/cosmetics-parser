import express from "express";
import cors, { CorsOptions } from "cors";
import authRoutes from "./routes/authRoutes";
import cookieParser from "cookie-parser";
import { authMiddleware, AuthRequest } from "./middlewares/authMiddleware";

const app = express();
const port = process.env.API_PORT || 3001;

const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser())

app.use('/auth', authRoutes)

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.send("API is running with TypeScript!");
});

app.get('/main', authMiddleware, (req: AuthRequest, res) => {
  res.status(200).json({
        message: "Success! You are authenticated.",
        user: req.user 
      });
})