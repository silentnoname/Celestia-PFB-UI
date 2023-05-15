require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.NEXT_PUBLIC_PROXY_PORT || 3090;



//if process.env.NODE_SERVER is not set, alert and exit
if (!process.env.NODE_SERVER) {
    console.log('NODE_SERVER is not set, please set it to the server you want to proxy to, example: http://localhost:26659');
    process.exit(1);
}

app.use(cors());

app.use('/submit_pfb', (req, res, next) => {
    //if sumbiturl is empty, use default server
    let TARGET_SERVER
    if (!req.headers['submiturl']) {
        TARGET_SERVER = process.env.NODE_SERVER ;
    }
    else {
        TARGET_SERVER =  req.headers['submiturl'];
    }


    const proxy = createProxyMiddleware({
        target: TARGET_SERVER,
        changeOrigin: true,
        pathRewrite: (path, req) => {
            return '/submit_pfb';
        },
        onProxyReq: (proxyReq) => {
            proxyReq.removeHeader('origin');
        },
        onProxyRes: (proxyRes) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = req.headers.origin || '*';
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS';
            proxyRes.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, submiturl';
        },
    });

    proxy(req, res, next);
});

app.listen(PORT, () => {
    console.log(`Proxy server is running on http://localhost:${PORT}`);
})