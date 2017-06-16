'use strict';
let Venue = require('./../entities/venue');

const dynamodb = require('../dynamodb');
const Q = require('q');
const responseHelper = require('../helpers/http_response_helper');

const venuesTableName = process.env.VENUES_TABLE;

module.exports.create = (event, context, callback) => {
  const data = JSON.parse(event.body);

  let venue = new Venue(data);
  venue.generateId();
  try {
    venue.validate();
  } catch (error) {
    callback(null, responseHelper.createResponseWithError(500, error.message));
    return
  }

  checkExisting(venue)
      .then(() => createVenue(venue, callback))
      .fail(error => callback(null, responseHelper.createResponseWithError(500, error)));
};

//TODO: get rid of code duplication
function checkExisting(venue) {
  let deferred = Q.defer();
  getAllExistingShortNames().then((names) => {
    if (names.includes(venue.name)) {
      deferred.reject('Venue with such name already exists');
    }
    deferred.resolve();
  });
  return deferred.promise;
}

//TODO: get rid of code duplication
function getAllExistingShortNames() {
  let deferred = Q.defer();
  let params = {TableName: process.env.VENUES_TABLE};
  dynamodb.scan(params, (error, data) => {
    let names = data.Items.map((venue) => venue.name);
    deferred.resolve(names);
  });
  return deferred.promise;
}

function createVenue(venue, callback) {
  const params = {
    TableName: venuesTableName,
    Item: venue,
  };

  dynamodb.put(params, (error) => {
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t create the item.'));
      return;
    }

    let response = responseHelper.createSuccessfulResponse(params.Item);
    callback(null, response);
  });
};
