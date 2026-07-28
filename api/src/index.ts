import express from "express";
import cors from "cors";
import { authRoutes } from "@api/routes/authRoutes.js";
import cookieParser from "cookie-parser";
import { authMiddleware } from "@api/middlewares/authMiddleware.js";
import { getEnvOrThrow } from "@api/utils/getEnvOrThrow.js";
import { productRoutes } from "@api/routes/productRoutes.js";
import { setupCronJobs } from "@api/cron/index.js";
import { notificationRoutes } from "@api/routes/notificationRoutes.js";
import { channelRoutes } from "@api/routes/channelRoutes.js";
import { userRoutes } from "@api/routes/userRoutes.js";
import "@api/config/index.js";

const app = express();
const port = getEnvOrThrow('API_PORT');

setupCronJobs();

const corsOptions = {
  origin: [getEnvOrThrow('FE_ORIGIN')],
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser())

app.use('/auth', authRoutes);
app.use('/product', productRoutes)
app.use('/notification', notificationRoutes);
app.use('/channel', channelRoutes)
app.use('/user', userRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.send("API is running with TypeScript!");
});
