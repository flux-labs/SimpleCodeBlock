'use strict';
var modeling = require('flux-modelingjs').modeling();
function run(XDomain, YDomain, num) {
  return {
      Pts: GetPointGrid2DRandomFromDomain(XDomain, YDomain, num)
  };
}
module.exports = {
    run: run
};
function GetPointGrid2DRandomFromDomain(Xdomain, Ydomain, num){
    var pts = [];
    for (var i = 0 ; i < num; ++i) {
        pts.push(modeling.entities.point([GetRandom(Xdomain[0], Xdomain[1]), GetRandom(Ydomain[0], Ydomain[1]), 0]));
    };
    return pts;
}
function GetRandom(min, max) {
  return Math.random() * (max - min) + min;
}