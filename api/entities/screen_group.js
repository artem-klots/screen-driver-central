const uuid = require('uuid');

class ScreenGroup {
    constructor(group) {
        if (group) {
            this.id = group.id;
            this.name = group.name;
            this.content_id = group.content_id ? group.content_id : null;
            this.screens = group.screens ? group.screens : [];
            return;
        }
        this.content_id = null;
        this.screens = [];
        this._rev = 0;
    }

    validate() {
        if (!this.name || this.name == '') throw new Error('Group can\'t be without name');
    };

    generateId() {
        this.id = uuid.v1();
    };
}

module.exports = ScreenGroup;
