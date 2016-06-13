'use strict';
var modeling = require('flux-modelingjs').initialize().modeling;

function run(pts) {
  return {
      Mesh: GetMeshFromExtrudedPoint(pts),
      cpt: GetCenterVec(pts)
  };
}
module.exports = {
    run: run
};
function GetMeshFromExtrudedPoint(vertices){
  var cpt =  GetCenterVec(vertices);
  cpt.__data__.point[2] = 2;
  var Vertices = vertices
  var mesh = modeling.entities.mesh();
  for(var i = 0; i < Vertices.length; ++i) {
      mesh.vertex(Vertices[i]);
  }
  mesh.vertex(cpt);
  for(var j = 0; j < Vertices.length; ++j) {
      mesh.face(j+1, j, Vertices.length );
  }
  mesh.face(Vertices.length -1, 0, Vertices.length );
  return mesh;
}
function GetCenterVec(vecs){
    var pt = [0,0,0];
    var c = vecs.length;
    for(var i =0; i < c; ++i){
        pt[0] += vecs[i].point[0];
        pt[1] += vecs[i].point[1];
        pt[2] += vecs[i].point[2];
    }
    return modeling.entities.point([pt[0]/c,pt[1]/c,pt[2]/c]);
}