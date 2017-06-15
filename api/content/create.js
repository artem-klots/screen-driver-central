'use strict';

const uuid = require('uuid');
const Q = require('q');
const dynamoDb = require('../dynamodb');
const responseHelper = require('../helpers/http_response_helper');

module.exports.create = (event, context, callback) => {
    const data = JSON.parse(event.body);
    performValidation(data)
        .then(() => createContent(data))
        .then(response => callback(null, responseHelper.createSuccessfulResponse(response)))
        .fail(error => callback(null, responseHelper.createResponseWithError(500, error)));
};

function performValidation(content) {
    let deferred = Q.defer();
    if (!content.short_name || !content.url) {
        deferred.reject('Content object should contain short_name and url fields');
    }
    if (typeof content.short_name !== 'string' || typeof content.url !== 'string') {
        deferred.reject('short_name and url fields should be a string');
    }
    deferred.resolve();
    return deferred.promise;
}

function createContent(content) {
    let params = initParamsForCreation(content);
    return performPut(params);
}

function initParamsForCreation(content) {
    return {
        TableName: process.env.CONTENT_TABLE,
        Item: {
            id: uuid.v1(),
            short_name: content.short_name,
            url: content.url
        }
    }
}

function performPut(params) {
    let deferred = Q.defer();
    dynamoDb.put(params, error => {
        if (error) {
            deferred.reject('Couldn\'t create the content.');
        }
        deferred.resolve(params.Item);
    });
    return deferred.promise;
}