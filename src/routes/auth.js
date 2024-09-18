import express from "express";
import * as controllers from "../controllers"

const router = express.Router();

router.post("/login", controllers.loginController
);

router.post("/register", controllers.registerController
);

module.exports = router;