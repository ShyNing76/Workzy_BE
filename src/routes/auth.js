import express from "express";
import * as controllers from "../controllers"

const router = express.Router();

router.post("/login",
    /*
     #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: 'object',
                    properties: {
                        email: {
                            type: 'string',
                            example: 'lehoangtrong1@gmail.com'
                        },
                        password: {
                            type: 'string',
                            example: 'lehoangtrong'
                        }
                    },
                    required: ['email', 'password']
                }
            }
        }
    }
    #swagger.description = 'Authenticate a user using their email and password.'
    #swagger.summary = 'Login to the system'
    */
    controllers.loginController);


router.post("/register",
    /*
     #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: 'object',
                    properties: {
                        email: {
                            type: 'string',
                            example: 'lehoangtrong1@gmail.com'
                        },
                        password: {
                            type: 'string',
                            example: 'lehoangtrong'
                        },
                        name: {
                            type: 'string',
                            example: 'Le Hoang Trong'
                        }
                    },
                    required: ['email', 'password', 'name']
                }
            }
        }
    }
    #swagger.description = 'Register a new customer.'
    #swagger.summary = 'Register a new customer'
    */
    controllers.registerController);

module.exports = router;