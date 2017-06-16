'use strict';

const Q = require('q');
const dynamoDb = require('../dynamodb');
const responseHelper = require('../helpers/http_response_helper');

module.exports.delete = (event, context, callback) => {
    let contentId = event.pathParameters.id;
    deleteContent(contentId)
        .then(() => callback(null, responseHelper.createSuccessfulResponse({})))
        .fail(error => callback(null, responseHelper.createResponseWithError(500, error)));
};

function deleteContent(contentId) {
    let params = initParamsForDeleting(contentId);
    return performDelete(params);
}

function initParamsForDeleting(contentId) {
    return {
        TableName: process.env.CONTENT_TABLE,
        Key: {
            id: contentId
        }
    }
}

function performDelete(params) {
    let deferred = Q.defer();
    dynamoDb.delete(params, (error, data) => {
        if (error) {
            deferred.reject('Couldn\'t delete the content.');
        }
        deferred.resolve();
    });
    return deferred.promise;
}