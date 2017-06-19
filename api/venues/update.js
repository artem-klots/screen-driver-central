'use strict';

let Venue = require('./../entities/venue');
let ScreenGroup = require('./../entities/screen_group');

const dynamodb = require('../dynamodb');
const Q = require('q');
const responseHelper = require('../helpers/http_response_helper');

const venuesTableName = process.env.VENUES_TABLE;

module.exports.update = (event, context, callback) => {
    const data = JSON.parse(event.body);
    data.id = event.pathParameters.id;
    let venue = new Venue(data);

    if (!venue._rev && data._rev !== 0) {
        callback(null, responseHelper.createResponseWithError(500, 'Missed revision number'));
        return;
    }

    try {
        venue.validate();
    } catch (error) {
        callback(null, responseHelper.createResponseWithError(500, error.message));
        return;
    }

    var params = getRequestParameters(venue);
    checkUniquenessOfVenueName(venue)
        .then(() => update(params, callback))
        .fail(error => {
            let message = error.message ? error.message : error;
            callback(null, responseHelper.createResponseWithError(500, message));
        });
};

function getRequestParameters(venue) {
    return {
        TableName: venuesTableName,
        Key: {
            id: venue.id,
        },
        ExpressionAttributeNames: {
            '#venue_name': 'name',
            '#rev': '_rev',
        },
        ExpressionAttributeValues: {
            ':name': venue.name,
            ':content_id': venue.content_id,
            ':screen_groups': venue.screen_groups,
            ':rev': venue._rev,
            ':new_rev': ++venue._rev,
        },
        UpdateExpression: 'SET #venue_name = :name, content_id = :content_id, screen_groups = :screen_groups, #rev = :new_rev',
        ConditionExpression: "#rev = :rev",
        ReturnValues: 'ALL_NEW',
    };
}

function checkUniquenessOfVenueName(venue) {
    let deferred = Q.defer();
    getAllExistingNamesBesidesCurrent(venue).then((names) => {
        if (names.includes(venue.name)) {
            deferred.reject('Venue with such name already exists');
        }
        deferred.resolve();
    });
    return deferred.promise;
}

function getAllExistingNamesBesidesCurrent(venue) {
    let deferred = Q.defer();
    let params = {TableName: venuesTableName};
    dynamodb.scan(params, (error, data) => {
        let names = data.Items
            .filter(item => item.id !== venue.id)
            .map((venue) => venue.name);
        deferred.resolve(names);
    });
    return deferred.promise;
}


function update(params, callback) {
    dynamodb.update(params, (error, result) => {
        if (error) {
            callback(null, responseHelper.createResponseWithError(500, error.message));
            return;
        }
        const response = responseHelper.createSuccessfulResponse(result.Attributes);
        callback(null, response);
    });
}
