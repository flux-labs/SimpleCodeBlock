'use strict';
var modeling = require('flux-modelingjs').modeling();
function run(x,y,z, spacingX, spacingY, spacingZ) {
  return {
      Pts: GetPointGrid3DWithSpacing(x,y,z, spacingX, spacingY, spacingZ)
  };
}
module.exports = {
    run: run
};
function GetPointGrid3DWithSpacing(x,y,z, spacingX , spacingY, spacingZ){
    var pts = [];
    for (var k = 0 ; k < z; ++k) {
        for (var j = 0 ; j < y; ++j) {
            for (var i = 0 ; i < x; ++i) {
                pts.push(modeling.entities.point([i *spacingX, j * spacingY, k * spacingZ ]) );
            };
        };
    };
    return pts;
}