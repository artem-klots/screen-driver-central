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
        if (!Number.isInteger(Number(this._rev)) && this._rev !== 0) throw new Error('Venue\'s revision should be a number');
        if (this._rev < 0) throw new Error('Venue\'s revision can\'t be < 0');
        this.validateScreenGroups();
    };

    validateScreenGroups() {
        if (!this.screen_groups || this.screen_groups.size == 0) {
            return;
        }

        this.screen_groups.forEach(group => {
            let matches = 0;
            this.screen_groups.forEach(element => {
                if (group.name == element.name) matches++;
            });
            if (matches > 1) {
                throw new Error('Groups should have unique names');
            }
        });
    }

    generateId() {
        this.id = uuid.v1();
    };

    increaseRevision() {
        this._rev++;
    };
}

module.exports = Venue;
