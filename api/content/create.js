'use strict';

const uuid = require('uuid');

const dynamoDb = require('../dynamodb');

module.exports.create = (event, context, callback) => {
    const data = JSON.parse(event.body);
    validateContent(data);
    createContent(data, callback);
};

function validateContent(content) {
    if (!content.short_name || !content.url) {
        throw new Error('Content object should contain short_name and url fields');
    }

    if (typeof content.short_name !== 'string' || typeof content.url !== 'string') {
        throw new Error('short_name and url fields should be a string');
    }
}

function createContent(content, callback) {
    let params = initParamsForCreation(content);
    performPut(params, callback);
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

function performPut(params, callback) {
    dynamoDb.put(params, (error) => {
        if (error) {
            console.error(error);
            callback(new Error('Couldn\'t create the content.'));
            return;
        }

        callback(null, createResponse(params));
    });
}

function createResponse(params) {
    return {
        statusCode: 200,
        body: JSON.stringify(params.Item)
    }
}