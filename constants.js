module.exports = Object.freeze({
    NationalParksAPIHost: 'https://developer.nps.gov/',
    NationalParksAPIBasePath: '/api/v1',
    ValidParams: {
        '/parks': ['limit', 'start', 'parkCode', 'stateCode', 'q', 'sort']
    }
});