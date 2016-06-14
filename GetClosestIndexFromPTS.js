
///////////////////////////////////////////////////////////////////////////// GetClosestIndexFromPTS
'use strict';
var modeling = require('flux-modelingjs').initialize().modeling;
function run(pts, p) {
  var Index = GetClosestIndexFromPTS(p, pts);
  console.log(Index);
  return {
      index: Index,// GetPointGrid3DWithSpacing(x,y,z, spacingX, spacingY, spacingZ),
      cp: pts[Index]
  };
}

module.exports = {
    run: run
};

function GetClosestIndexFromPTS(p, targetPTs){
    var ClosestIndex = 0;
    var dis = [];
  console.log(p.point);
    for (var i = 0; i < targetPTs.length; ++i){
        dis.push(GetDistance(p,targetPTs[i]));
    }
    var temp = 100000;
    for (var i = 0; i < dis.length; ++i){
      console.log(dis[i]);
        if (dis[i] < temp){
            temp = dis[i];
            ClosestIndex = i;
        }
    }
    return ClosestIndex;
}
function GetDistance(v1, v2){
  return (Math.abs(Math.sqrt(((v2.point[0] - v1.point[0]) * (v2.point[0] - v1.point[0])) + ((v2.point[1] - v1.point[1]) * (v2.point[1] - v1.point[1])) + ((v2.point[2] - v1.point[2]) * (v2.point[2] - v1.point[2])))));
}