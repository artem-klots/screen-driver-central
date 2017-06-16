'use strict';

const dynamodb = require('../dynamodb');
const responseHelper = require('../helpers/http_response_helper');

const venuesTableName = process.env.VENUES_TABLE;

module.exports.delete = (event, context, callback) => {
    let data = JSON.parse(event.body);
    data.id = event.pathParameters.id;
    let params = getRequestParameters(data.id);

    deleteVenue(params, callback);
};

function getRequestParameters(id) {
    return {
        TableName: venuesTableName,
        Key: {
            id: id,
        },
    };
}

function deleteVenue(params, callback) {
    dynamodb.delete(params, (error) => {
        if (error) {
            callback(null, responseHelper.createResponseWithError(500, 'Couldn\'t remove the todo item. ' + error.message));
            return;
        }

        const response = responseHelper.createSuccessfulResponse();
        callback(null, response);
    });
}
