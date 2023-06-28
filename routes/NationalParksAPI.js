const express = require('express');
var proxy = require('express-http-proxy');
const router = express.Router();
const constants = require('../constants');
const HttpError = require('../error/HttpError');


// router.use((req, res, next) => {
//     console.log('Request start time:', Date.now());
//     next();
//     console.log('Request end time: ', Date.now());
// });

router.get('/parks', (req, res) => {
    const params = req.params;
    console.log('req params', params);
    console.log("req query", req.query);
    console.log('url', req.url);
    console.log('path', req.path);
    res.send('NationalParksAPI / route');
});

const npProxy = proxy(constants.NationalParksAPIURL, {
    // want the part after npapi/...
    // actually it looks like npapi gets consumed. The path after this point is just /parks
    // so just validate query params
    proxyReqPathResolver: (req) => proxyReqPathResolver(req)
});

function proxyReqPathResolver(req) {
    const validQueryParams = constants.ValidParams[req.path];
    for(const property in req.query){
        if(!validQueryParams.includes(property)){
            throw new HttpError('Bad Request', 400);
        }
    }
    return req.url;
}

if (process.env.NODE_ENV === 'test') {
    exports.test = { proxyReqPathResolver };
}

exports.npProxy = npProxy;
exports.router = router;