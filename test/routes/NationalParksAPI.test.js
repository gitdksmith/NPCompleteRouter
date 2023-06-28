const request = require("supertest");
const app = require("../../app");
const HttpError = require("../../error/HttpError");
const { proxyReqPathResolver } = require('../../routes/NationalParksAPI').test;

describe("Test proxy methods for National Parks API", () => {

    // test("It should return park data", async () => {
    //     const response = await request(app).get("/npapi/parks");
    //     expect(response.statusCode).toBe(200);
    // });

    test('It should validate the request query parameters', () => {
        let req = {
            url: '/parks?limit=50&start=0',
            path: '/parks',
            query: {limit: 50, start: 0}
        };
        expect(proxyReqPathResolver(req)).toBe(req.url);

        req.query = {limit: 50, badParam: 1};
        expect(() => {proxyReqPathResolver(req)}).toThrow(HttpError);
    })
});