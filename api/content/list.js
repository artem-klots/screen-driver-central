'use strict';

const dynamoDb = require('../dynamodb');
const responseHelper = require('../helpers/http_response_helper');

const params = {
    TableName: process.env.CONTENT_TABLE,
};

module.exports.list = (event, context, callback) => {
    dynamoDb.scan(params, (error, result) => {
        if (error) {
            callback(null, responseHelper.createResponseWithError(500, 'Couldn\'t fetch the todos.'));
            return;
        }

        callback(null, responseHelper.createSuccessfulResponse(result.Items));
    });
};