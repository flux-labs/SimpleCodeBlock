'use strict';
var modeling = require('flux-modelingjs').initialize().modeling;
function run(points, closed) {
  return {
      Polyline: GetPolylineFromPts(points, closed)
  };
}
module.exports = {
    run: run
};
function GetPolylineFromPts (vecs, bool) {
    var lns = [];
    if(bool){
        for( var i =0, c = vecs.length; i < c-1 ; i++){
            if(i != vecs.length-2){
                lns.push(modeling.entities.line(vecs[i], vecs[i+1]));
            }else{
                lns.push(modeling.entities.line(vecs[i], vecs[i+1]));
                lns.push(modeling.entities.line(vecs[i+1], vecs[0])); 
            }
        }
    }else{
        for( var i =0, c = vecs.length; i < c -1 ; i++){
            lns.push(modeling.entities.line(vecs[i], vecs[i+1]));
        }
    }
    return lns;    
};