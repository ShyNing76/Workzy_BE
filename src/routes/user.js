import * as controller from "../controllers";

const router = require('express').Router();

// router.use(require('../middlewares/auth'));

router.get('/', controller.getUser); // GET /api/v1/users

module.exports = router;