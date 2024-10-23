import cors from "cors";
import express from "express";
import job from "./config/checkBookingStatus";
import initWebRoutes from "./routes/v1";
require("dotenv").config();
require("./config/passport");

const app = express();
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

initWebRoutes(app);

app.listen(port, () => {
    console.log(`=================================`);
    console.log(`======= SERVER STARTED =========`);
    console.log(`=================================`);
    console.log(`Server is running on ${port}`);
    console.log(`=================================`);
    job.start();
});

export default app;
