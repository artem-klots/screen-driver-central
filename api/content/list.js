'use strict';

const dynamoDb = require('../dynamodb');
const params = {
    TableName: process.env.CONTENT_TABLE,
};

module.exports.list = (event, context, callback) => {
    dynamoDb.scan(params, (error, result) => {
        if (error) {
            console.error(error);
            callback(new Error('Couldn\'t fetch the todos.'));
            return;
        }

        const response = {
            statusCode: 200,
            body: JSON.stringify(result.Items),
        };
        callback(null, response);
    });
};