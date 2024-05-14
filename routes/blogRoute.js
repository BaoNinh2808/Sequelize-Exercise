// xử lý các đường dẫn bắt đầu từ /

const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

router.get('/', controller.blogs);
router.get('/:id', controller.blog_detail);

module.exports = router;