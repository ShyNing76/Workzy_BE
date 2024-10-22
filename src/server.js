import cors from "cors";
import express from "express";
import job from "./config/checkBookingStatus";
import initWebRoutes from "./routes/v1";
import { createServer } from "http";
import { Server } from "socket.io";
import { initSocket } from "./socket";
require("dotenv").config();
require("./config/passport");

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
    },
});

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

initSocket(io);
initWebRoutes(app);

server.listen(port, () => {
    console.log(`=================================`);
    console.log(`======= SERVER STARTED =========`);
    console.log(`=================================`);
    console.log(`Server is running on ${port}`);
    console.log(`=================================`);
    job.start();
});

export default app;
