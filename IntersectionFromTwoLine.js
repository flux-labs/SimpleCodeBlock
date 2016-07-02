/////////////////////////////////////////////////////////////////////////////////////////////////////////// IntersectionFromTwoLine
'use strict';
var modeling = require('flux-modelingjs').initialize().modeling;
function run(ln1, ln2) {
  return {
      Pt : CheckIntersection(ln1.start[0], ln1.start[1], ln1.end[0], ln1.end[1], ln2.start[0], ln2.start[1], ln2.end[0], ln2.end[1] )
  };
}
module.exports = {
    run: run
};
//https://github.com/psalaets/line-intersect
 function CheckIntersection(x1, y1, x2, y2, x3, y3, x4, y4){
    var denom = ((y4 - y3) * (x2 - x1)) - ((x4 - x3) * (y2 - y1));
    var numeA = ((x4 - x3) * (y1 - y3)) - ((y4 - y3) * (x1 - x3));
    var numeB = ((x2 - x1) * (y1 - y3)) - ((y2 - y1) * (x1 - x3));
    if (denom == 0) {
      if (numeA == 0 && numeB == 0) {
        return false; //colinear();
      }
      return false; // parallel();
    }
    var uA = numeA / denom;
    var uB = numeB / denom;
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
      var x = x1 + (uA * (x2 - x1));
      var y = y1 + (uA * (y2 - y1));
      return modeling.entities.point([x,y,0])
    }
    return false;
};