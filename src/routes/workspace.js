import express from "express";
import * as controllers from "../controllers";
import {verify_manager, verify_token} from "../middlewares/verifyToken";
import {createWorkspaceController} from "../controllers";

const router = express.Router();

router.post("/", verify_token, verify_manager, controllers.createWorkspaceController);

module.exports = router;