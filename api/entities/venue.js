const uuid = require('uuid');

class Venue {
    constructor(venue) {
        if (venue) {
            this.id = venue.id;
            this.name = venue.name;
            this.content_id = venue.content_id ? venue.content_id : null;
            this.screen_groups = venue.screen_groups ? venue.screen_groups : [];
            this._rev = venue._rev ? venue._rev : 0;
            return;
        }
        this.content_id = null;
        this.screen_groups = [];
        this._rev = 0;
    }

    validate() {
        if (!this.name) throw new Error('Venue can\'t be without name');
        if (this.name == '') throw new Error('Venue can\'t be without name');
        if (!this._rev && this._rev !== 0) throw new Error('Venue can\'t be without revision number');
        if (Number.isInteger(Number(this._rev)) && this._rev !== 0) throw new Error('Venue\'s revision should be a number');
        if (this._rev < 0) throw new Error('Venue\'s revision can\'t be < 0');
    };

    generateId() {
        this.id = uuid.v1();
    };

    increaseRevision() {
        this._rev++;
    };
}

module.exports = Venue;
