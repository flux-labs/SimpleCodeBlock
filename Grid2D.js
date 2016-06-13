'use strict';
var modeling = require('flux-modelingjs').initialize().modeling;
function run(x,y, spacingX, spacingY) {
  return {
      Pts: GetPointGrid2DWithSpacing(x,y, spacingX, spacingY)
  };
}
module.exports = {
    run: run
};