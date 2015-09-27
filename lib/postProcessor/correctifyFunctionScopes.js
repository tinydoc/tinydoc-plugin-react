var where = require('lodash').where;
var K = require('tinydoc/plugins/cjs/Parser/constants');

module.exports = function(database) {
  database
    .filter(function(doc) {
      return doc.isModule && doc.ctx.type === 'component';
    })
    .forEach(function(doc) {
      where(database, { receiver: doc.id }).forEach(function(entityDoc) {
        console.log(entityDoc.id, doc.ctx.statics);

        if (entityDoc.ctx.type === K.TYPE_FUNCTION) {
          if (doc.ctx.statics.indexOf(entityDoc.id) > -1) {
            entityDoc.ctx.scope = K.SCOPE_UNSCOPED;
          }
          else {
            entityDoc.ctx.scope = K.SCOPE_INSTANCE;
          }
        }
      });
    })
  ;
};