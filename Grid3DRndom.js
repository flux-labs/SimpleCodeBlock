'use strict';
var modeling = require('flux-modelingjs').initialize().modeling;
function run(XDomain, YDomain, ZDomain, num) {
  return {
      Pts: GetPointGrid3DRandomFromDomain(XDomain, YDomain, ZDomain, num)
  };
}
module.exports = {
    run: run
};
function GetPointGrid3DRandomFromDomain(Xdomain, Ydomain, Zdomain, num){
    var pts = [];
    for (var i = 0 ; i < num; ++i) {
        pts.push(modeling.entities.point( [GetRandom(Xdomain[0], Xdomain[1]), GetRandom(Ydomain[0], Ydomain[1]), GetRandom(Zdomain[0], Zdomain[1])]));
    };
    return pts;
}
function GetRandom(min, max) {
  return Math.random() * (max - min) + min;
}