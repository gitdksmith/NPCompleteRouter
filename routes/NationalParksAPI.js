const express = require('express');
const proxy = require('express-http-proxy');
const router = express.Router();
const constants = require('../constants');
const HttpError = require('../error/HttpError');

router.get('/parks', (req, res) => {
    const params = req.params;
    console.log('req params', params);
    console.log("req query", req.query);
    console.log('url', req.url);
    console.log('path', req.path);
    res.send('NationalParksAPI / route');
});

const filters = {
    proxyReqPathResolver: (req) => proxyReqPathResolver(req),
    filter: (req, res) => filterFunction(req, res),
    limit: '0mb',
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => proxyReqOptDecorator(proxyReqOpts, srcReq)
};

const npProxy = proxy(constants.NationalParksAPIHost, filters);

function proxyReqPathResolver(req) {
    const validQueryParams = constants.ValidParams[req.path];
    for (const property in req.query) {
        if (!validQueryParams.includes(property)) {
            throw new HttpError('Bad Request', 400);
        }
    }
    return constants.NationalParksAPIBasePath + req.url;
}

function filterFunction(req, res) {
    return req.method == 'GET';
}

function proxyReqOptDecorator(proxyReqOpts, srcReq) {
    proxyReqOpts.headers['x-api-key'] = process.env.NP_X_API_KEY;
    return proxyReqOpts;
}

if (process.env.NODE_ENV === 'test') {
    exports.test = { proxyReqPathResolver, filterFunction, proxyReqOptDecorator, filters };
}

exports.npProxy = npProxy;
