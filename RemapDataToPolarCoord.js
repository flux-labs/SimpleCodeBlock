'use strict';
var modeling = require('flux-modelingjs').modeling();
function run(Data, Scale ) {
  let Point = modeling.entities.point([0,0,0]);
  return {
      Ln: GetLineByRemapDataToPolar(Data, Point, Scale),
      Cir:GetCircleFromMinMax(Data, Point, Scale)
  };
}
module.exports = {
    run: run
};
function GetLineByRemapDataToPolar(d, p, s){
    let lns = [];
    let xRes = d.length;
    let kInterval = ((3.14159 * 2) - 0.0) / xRes;
    for (let j = 0; j < xRes; j++){
        let angle = kInterval * j;
        let radius = s * d[j];
        let y = radius * (Math.sin(angle));
        let x = radius * (Math.cos(angle));
        let p2 = modeling.entities.point([x + p.__data__.point[0], y + p.__data__.point[1], 0 + p.__data__.point[2]]);
        lns.push(modeling.entities.line(p, p2));
    }
    return lns;
}
function GetCircleFromMinMax( d, p, s){
    let cir = [];
    let domain = GetDomain(d);
    cir.push(modeling.entities.circle(p, domain[0] * s));
    cir.push(modeling.entities.circle(p, domain[1] * s));
    return cir;
}
function GetDomain(dataList){
    var domain = [];
    var Min = dataList[0];
    var Max = dataList[0];
    for(var i  = 1, c = dataList.length; i < c; ++i){
        if (Min > dataList[i]){
            Min = dataList[i];
        }
        if (Max < dataList[i]){
            Max = dataList[i];
        }
    }
    domain.push(Min);
    domain.push(Max);
    return domain;
};