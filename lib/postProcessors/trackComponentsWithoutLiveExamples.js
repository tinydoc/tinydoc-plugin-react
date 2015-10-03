module.exports = function(database, track) {
  database
    .filter(function(doc) {
      return doc.isModule && doc.ctx.type === 'component';
    })
    .forEach(function(doc) {
      track(doc.absoluteFilePath, doc.name);
    })
  ;
};