require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const express = require('express');
const request = require("supertest");
const nock = require('nock');

const constants = require("../../constants");
const HttpError = require("../../error/HttpError");
const parksApi = require('../../routes/NationalParksAPI');
const { proxyReqPathResolver, filterFunction, proxyReqOptDecorator } = parksApi.test;


describe("Test proxy methods for National Parks API", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("It should call all proxy filter functions", async () => {
        let npProxySpy = jest.spyOn(parksApi, 'npProxy');
        let filterSpy = jest.spyOn(parksApi.test.filters, 'filter');
        let resolverSpy = jest.spyOn(parksApi.test.filters, 'proxyReqPathResolver');
        let decoratorSpy = jest.spyOn(parksApi.test.filters, 'proxyReqOptDecorator');
        
        nock('https://developer.nps.gov')
        .get(`/api/v1/parks`)
        .reply(200, 'mock response');

        const app = express();
        app.use('/npapi', parksApi.npProxy);
        const response = await request(app).get("/npapi/parks");

        expect(npProxySpy).toHaveBeenCalled();
        expect(filterSpy).toHaveBeenCalled();
        expect(filterSpy.mock.results[0].value).toBe(true);
        expect(resolverSpy).toHaveBeenCalled();
        expect(resolverSpy.mock.results[0].value).toBe('/api/v1/parks');
        expect(decoratorSpy).toHaveBeenCalled();
        expect(decoratorSpy.mock.results[0].value.headers['x-api-key']).toBe('TEST_API_KEY')

        expect(response.text).toBe('mock response');
    });

    it('Should validate the request query parameters', () => {
        let req = {
            url: '/parks?limit=50&start=0',
            path: '/parks',
            query: { limit: 50, start: 0 }
        };
        expect(proxyReqPathResolver(req)).toBe(constants.NationalParksAPIBasePath + req.url);

        req.query = { limit: 50, badParam: 1 };
        expect(() => { proxyReqPathResolver(req) }).toThrow(HttpError);
    });

    it('Should return true if method is GET, false otherwise', () => {
        let req = {
            method: 'GET'
        }
        expect(filterFunction(req)).toBe(true);
        req.method = 'POST';
        expect(filterFunction(req)).toBe(false);
    });

    it('Should modify the header to include API key from env variables', () => {
        let srcReq = null;
        let proxyReqOpts = {
            headers: {
                'Content-Type': 'text/html'
            }
        }
        let expectedResponse = {
            headers: {
                'Content-Type': 'text/html',
                'x-api-key': 'TEST_API_KEY'
            }
        }
        expect(proxyReqOptDecorator(proxyReqOpts, srcReq)).toStrictEqual(expectedResponse);
    })
});