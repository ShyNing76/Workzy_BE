import * as controller from "../controllers";

const router = require('express').Router();

/**
 * @swagger
 * /customer/profile:
 *   get:
 *     summary: Retrieve user profile information
 *     description: Gets the profile information of the currently authenticated user.
 *     tags:
 *       - Profile
 */
router.get('/profile', controller.getUser);

/**
 * @swagger
 * /customer/profile:
 *  post:
 *   summary: Update user profile information
 *   description: Updates the profile information of the currently authenticated user.
 *   tags:
 *   - Profile
 */
router.post('/profile', controller.updateUser);

module.exports = router;