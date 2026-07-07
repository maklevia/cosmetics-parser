import express from "express";
import cors, { CorsOptions } from "cors";
import authRoutes from "./routes/authRoutes";
import cookieParser from "cookie-parser";
import { authMiddleware } from "./middlewares/authMiddleware";
import { getEnvOrThrow } from "./utils/getEnvOrThrow";

const app = express();
const port = getEnvOrThrow('API_PORT');

const corsOptions = {
  origin: [getEnvOrThrow('FE_ORIGIN')],
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

app.get('/main', authMiddleware, (req, res) => {
  res.status(200).json({
        message: "Success! You are authenticated.",
        user: res.locals.user 
      });
})