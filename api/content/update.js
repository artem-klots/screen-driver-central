'use strict';

const Q = require('q');
const dynamoDb = require('../dynamodb');
const responseHelper = require('../helpers/http_response_helper');

module.exports.update = (event, context, callback) => {
    let data = JSON.parse(event.body);
    data.id = event.pathParameters.id;
    performValidation(data)
        .then(() => checkExisting(data))
        .then(() => updateContent(data))
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

function checkExisting(contentForUpdate) {
    let deferred = Q.defer();
    getAllExistingShortNamesBesidesCurrent(contentForUpdate).then((shortNames) => {
        if (shortNames.includes(contentForUpdate.short_name)) {
            deferred.reject('Content with such name already exists');
        }
        deferred.resolve();
    });
    return deferred.promise;
}

function getAllExistingShortNamesBesidesCurrent(contentForUpdate) {
    let deferred = Q.defer();
    let params = {TableName: process.env.CONTENT_TABLE};
    dynamoDb.scan(params, (error, data) => {
        let shortNames = data.Items
            .filter(content => content.id !== contentForUpdate.id)
            .map(content => content.short_name);
        deferred.resolve(shortNames);
    });
    return deferred.promise;
}

function updateContent(content) {
    let params = initParamsForUpdating(content);
    return performUpdate(params);
}

function initParamsForUpdating(contentForUpdate) {
    return {
        TableName: process.env.CONTENT_TABLE,
        Key: {
            id: contentForUpdate.id
        },
        ConditionExpression: "#id = :id",
        UpdateExpression: "SET #short_name = :short_name, #url = :url",
        ExpressionAttributeNames: {
            "#id": "id",
            "#short_name": "short_name",
            "#url": "url"
        },
        ExpressionAttributeValues: {
            ":id": contentForUpdate.id,
            ":short_name": contentForUpdate.short_name,
            ":url": contentForUpdate.url
        },
        ReturnValues: "UPDATED_NEW"
    }
}

function performUpdate(params) {
    let deferred = Q.defer();
    dynamoDb.update(params, (error, data) => {
        if (error) {
            deferred.reject('Couldn\'t update the content.');
        }
        deferred.resolve(data ? data.Attributes : {});
    });
    return deferred.promise;
}