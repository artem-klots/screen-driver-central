module.exports.createSuccessfulResponse = (params) => {
    return {
        statusCode: 200,
        body: JSON.stringify(params)
    }
};

module.exports.createResponseWithError = (statusCode, error) => {
    return {
        statusCode: statusCode,
        body: JSON.stringify(error)
    }
};