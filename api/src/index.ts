import express from "express";
import cors from "cors";
import { authRoutes } from "@api/modules/auth/authRoutes.js";
import cookieParser from "cookie-parser";
import { authMiddleware } from "@api/middlewares/authMiddleware.js";
import { getEnvOrThrow } from "@api/utils/getEnvOrThrow.js";
import { productRoutes } from "@api/modules/product/productRoutes.js";
import { setupCronJobs } from "@api/cron/index.js";
import { notificationRoutes } from "@api/modules/notification/notificationRoutes.js";
import { channelRoutes } from "@api/modules/channel/channelRoutes.js";
import { userRoutes } from "@api/modules/user/userRoutes.js";
import "@api/config/index.js";
import { errorMiddleware } from "@api/middlewares/errorMiddleware.js";

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

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.send("API is running with TypeScript!");
});
