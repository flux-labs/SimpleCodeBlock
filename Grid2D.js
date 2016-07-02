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
function GetPointGrid2DWithSpacing(x,y, spacingX , spacingY){
    var pts = [];
    for (var j = 0 ; j < y; ++j) {
        for (var i = 0 ; i < x; ++i) {
            pts.push(modeling.entities.point([i *spacingX, j * spacingY, 0 ]) );
        };
    };
    return pts;
}