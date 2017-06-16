'use strict';

let Venue = require('./../entities/venue');

const dynamodb = require('../dynamodb');
const responseHelper = require('../helpers/http_response_helper');

const venuesTableName = process.env.VENUES_TABLE;

module.exports.update = (event, context, callback) => {
    const data = JSON.parse(event.body);
    data.id = event.pathParameters.id;
    let venue = new Venue(data);

    if (!venue.id) {
        callback(null, responseHelper.createResponseWithError(500, 'Missed id'));
        return;
    }

    if (!venue._rev && data._rev !== 0) {
        callback(null, responseHelper.createResponseWithError(500, 'Missed revision number'));
        return;
    }

    var params = getRequestParameters(venue);
    update(params, callback);
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
