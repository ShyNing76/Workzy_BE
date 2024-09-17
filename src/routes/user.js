import * as controller from '../controllers';

const router = require('express').Router();

router.get('/', controller.getUser); // GET /api/v1/users

module.exports = router;