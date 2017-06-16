'use strict';

const uuid = require('uuid');
const Q = require('q');
const dynamoDb = require('../dynamodb');
const responseHelper = require('../helpers/http_response_helper');
const validator = require('./content_validator');

module.exports.create = (event, context, callback) => {
    const data = JSON.parse(event.body);
    performValidation(data)
        .then(() => checkExisting(data))
        .then(() => createContent(data))
        .then(response => callback(null, responseHelper.createSuccessfulResponse(response)))
        .fail(error => callback(null, responseHelper.createResponseWithError(500, error)));
};

function performValidation(content) {
    return validator.validate(content);
}

function checkExisting(content) {
    let deferred = Q.defer();
    getAllExistingShortNames().then((shortNames) => {
        if (shortNames.includes(content.short_name)) {
            deferred.reject('Content with such name already exists');
        }
        deferred.resolve();
    });
    return deferred.promise;
}

function getAllExistingShortNames() {
    let deferred = Q.defer();
    let params = {TableName: process.env.CONTENT_TABLE};
    dynamoDb.scan(params, (error, data) => {
        let shortNames = data.Items.map((content) => content.short_name);
        deferred.resolve(shortNames);
    });
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