import db from "./models";
import jwt from "jsonwebtoken";
import {v4} from "uuid";
import express from "express";
import cors from "cors";

require('dotenv').config()


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

const router = express.Router();

const token = v4();
const email = "lehoangtrongcsgl@gmail.com";

router.get("/", (req, res) => {
  res.redirect(`/api/v1/auth/google/login-success/${token}/${email}`);
})

router.get("/api/v1/auth/google/login-success/:token/:email",  (req, res) => {
    const {email, token} = req.query;
    const response = {
        email,
        token
    }
    return res.status(200).json(response);
})

app.use(router);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})