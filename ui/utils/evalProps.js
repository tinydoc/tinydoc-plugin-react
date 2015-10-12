module.exports = function(strProps) {
  let out = {};

  eval('out = ' + strProps + ';');

  return out;
}