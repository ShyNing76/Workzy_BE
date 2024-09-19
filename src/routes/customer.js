import * as controller from "../controllers";

const router = require('express').Router();

/**
 * @swagger
 * components:
 *   headers:
 *     Authorization:
 *       description: Access token used for user authentication.
 *       required: true
 *       schema:
 *         type: string
 * /profile:
 *   get:
 *     summary: Retrieve user information
 *     description: Returns user information based on the access token.
 *     tags:
 *     - User
 *     parameters:
 *       - $ref: '#/components/headers/Authorization'
 *     responses:
 *       '200':
 *         description: Success - User information has been returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   description: ID of the user.
 *                 name:
 *                   type: string
 *                   description: Name of the user.
 *                 email:
 *                   type: string
 *                   description: Email address of the user.
 *       '400':
 *         description: Bad Request - Error message for token validation.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *       '500':
 *         description: Internal Server Error - An error occurred while processing the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 */
router.get('/profile', controller.getUser);
router.post('/profile', controller.updateUser);

module.exports = router;