const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const router = express.Router();

// Proxy settings for different microservices
router.use('/api/clients', createProxyMiddleware({
    target: 'http://client-service:3000',
    changeOrigin: true,
    pathRewrite: {
        '^/api/clients': '',
    },
}));

router.use('/api/suppliers', createProxyMiddleware({
    target: 'http://supplier-service:3000',
    changeOrigin: true,
    pathRewrite: {
        '^/api/suppliers': '',
    },
}));

router.use('/api/invoices', createProxyMiddleware({
    target: 'http://billing-service:3000',
    changeOrigin: true,
    pathRewrite: {
        '^/api/invoices': '',
    },
}));

router.use('/api/auth', createProxyMiddleware({
    target: 'http://auth-service:3000',
    changeOrigin: true,
    pathRewrite: {
        '^/api/auth': '',
    },
}));

module.exports = router;
