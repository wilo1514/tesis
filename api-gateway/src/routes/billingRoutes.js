const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const router = express.Router();

router.use('/', createProxyMiddleware({
    target: process.env.BILLING_SERVICE_URL,
    changeOrigin: true
}));

module.exports = router;
