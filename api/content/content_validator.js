const Q = require('q');

module.exports.validate = (content) => {
    let deferred = Q.defer();
    if (!content.short_name || !content.url) {
        deferred.reject('Content object should contain short_name and url fields');
    }
    if (typeof content.short_name !== 'string' || typeof content.url !== 'string') {
        deferred.reject('short_name and url fields should be a string');
    }
    deferred.resolve();
    return deferred.promise;
};