const uuid = require('uuid');

var Venue = function (venue) {
    if (venue) {
        this.id = venue.id;
        this.name = venue.name;
        this.content_id = venue.content_id;
        this.screen_groups = venue.screen_groups;
        this._rev = venue._rev ? venue._rev : 0;
        return
    }
    this.screen_groups = [];
    this._rev = 0;
};

Venue.prototype.validate = function() {
    if (!this.name) throw new Error('Venue can\'t be without name');
    if (!this._rev) throw new Error('Venue can\'t be without revision number');
    if (this._rev < 0) throw new Error('Venue\'s revision can\'t be < 0');
};

//Maybe it should be implemented in constructor
Venue.prototype.generateId = function () {
    this.id = uuid.v1();
};

Venue.prototype.increaseRevision = function () {
    this._rev++;
};

module.exports = Venue;
