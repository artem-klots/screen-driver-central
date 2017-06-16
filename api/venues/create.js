'use strict';
let Venue = require('././venue');

const dynamodb = require('./../dynamodb');
const tableName = process.env.VENUES_TABLE;

module.exports.create = (event, context, callback) => {
  const data = JSON.parse(event.body);

  let venue = new Venue(data);
  venue.generateId();
  venue.validate();

  const params = {
    TableName: tableName,
    Item: venue,
  };

  dynamodb.put(params, (error) => {
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t create the item.'));
      return;
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};
