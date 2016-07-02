'use strict';
var modeling = require('flux-modelingjs').modeling();
function run(min, max) {
  return {
      Domain: GetDomainFromMinMax(min, max)
  };
}
module.exports = {
    run: run
};
function GetDomainFromMinMax(min, max){
    return [min, max];
}