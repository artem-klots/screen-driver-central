'use strict';

const dynamoDb = require('./../dynamodb');
const params = {
  TableName: process.env.VENUES_TABLE,
};

module.exports.list = (event, context, callback) => {
  console.log('getting all venues]');
  dynamoDb.scan(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t fetch the venues.'));
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
    callback(null, response);
  });
};
