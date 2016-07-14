'use strict';
var modeling = require('flux-modelingjs').modeling();
function run(mesh, angle, local) {
  
  let m;
  if(!local){
    m = rotateMesh(mesh, toRadians(angle));
  }else{
    let v = GetCenterVecFromMesh(mesh);
    v = v.toJSON();
    m = translateMesh(mesh, v, false);
    m = rotateMesh(mesh, toRadians(angle));
    m = translateMesh(mesh, v, true);
  }
  return {
    Mesh:m
  }
}
module.exports = {
    run: run
};
function rotateMesh(mesh, angle) {
  mesh.vertices = mesh.vertices.map( pt => rotatePoint(pt, angle) );
  return mesh;
}
function rotatePoint(pt, angle) {
  let cos = Math.cos(angle);
  let sin = Math.sin(angle);
  let x = pt[0] * cos - pt[1] * sin;
  let y = pt[0] * sin + pt[1] * cos;
  return [ x,y,pt[2] ];
}
function translateMesh(mesh, offset, remap) {
  if(remap){
    mesh.vertices = mesh.vertices.map( pt => [pt[0] + offset.point[0], pt[1] + offset.point[1], pt[2] + offset.point[2]] );
  }else{
    mesh.vertices = mesh.vertices.map( pt => [pt[0] - offset.point[0], pt[1] - offset.point[1], pt[2] - offset.point[2]] ); 
  }
  return mesh
}
function toRadians(d) { 
  return d / 180 * Math.PI; 
}
function GetCenterVecFromMesh(mesh){
  let vecs = mesh.vertices
    var pt = [0,0,0];
    var c = vecs.length;
    for(var i =0; i < c; ++i){
        pt[0] += vecs[i][0];
        pt[1] += vecs[i][1];
        pt[2] += vecs[i][2];
    }
    return modeling.entities.point([pt[0]/c,pt[1]/c,pt[2]/c]);
}
