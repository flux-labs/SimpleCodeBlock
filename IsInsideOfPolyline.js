'use strict';
var modeling = require('flux-modelingjs').modeling();
function run(Polyline, point) {
  let points = [];
   for(let i = 0, c = Polyline.length ; i < c; ++i){
    points.push(Polyline[i].start)
   }
  return {
      Bool: IsInsideOfPoint(point, points)
  };
}
module.exports = {
    run: run
};
//https://github.com/substack/point-in-polygon
function IsInsideOfPoint(v, vecs){
  let x = v.point[0], y = v.point[1];
  let inside = false;
  for (let i = 0, j = vecs.length - 1; i < vecs.length; j = i++) {
    let xi = vecs[i][0], yi = vecs[i][1];
    let xj = vecs[j][0], yj = vecs[j][1];
    let intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}