'use strict';
var modeling = require('flux-modelingjs').initialize().modeling;
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