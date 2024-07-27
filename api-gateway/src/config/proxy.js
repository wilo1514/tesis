// src/config/proxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use('/api/clients', createProxyMiddleware({ target: 'http://client-service:3000', changeOrigin: true }));
    app.use('/api/suppliers', createProxyMiddleware({ target: 'http://supplier-service:3000', changeOrigin: true }));
    app.use('/api/invoices', createProxyMiddleware({ target: 'http://billing-service:3000', changeOrigin: true }));
    app.use('/api/auth', createProxyMiddleware({ target: 'http://auth-service:3000', changeOrigin: true }));
};
