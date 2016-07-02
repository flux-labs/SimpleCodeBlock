'use strict';
var modeling = require('flux-modelingjs').initialize().modeling;

function run(Points, Closed) {
  var np = NPolyline.BuildWithPoint(Points);
  if(Closed) {
    np.Closed();
  }else{
    np.Open();
  }
  return {
      Polyline: np.ToLine(),
      Mesh: np.ToMesh(),
      Length: np.ComputeLength(),
      Area: np.ComputeArea(),
      Cpt : np.GetCenterPt()
  };
}
module.exports = {
    run: run
};


function NPolyline(){
  this.pts = [];
  this.isClosed = true;
  this.mesh = null;
}
NPolyline.prototype.Add = function(v){
  if (this.pts.length > 1){
    if (this.isClosed){
      this.Open();
      this.pts.push(v);
      this.Closed();
    }else{
      this.pts.push(v);
    }
  }else{
    this.pts.push(v);
  }
}
NPolyline.prototype.Closed = function(){
  this.isClosed = true;
  if(this.pts[0].Distance(this.pts[this.pts.length - 1]) != 0) this.pts.push(this.pts[0]);
}
NPolyline.prototype.Open = function(){
  this.isClosed = false;
  if(this.pts.length > 1) if (this.pts[0].Distance(this.pts[this.pts.length - 1]) == 0) this.pts.pop();
}
NPolyline.prototype.GetClosedPtFromPt = function(vec){
  let v = new NVector(vec.__data__.point[0], vec.__data__.point[1], vec.__data__.point[2]);
  let index = 0;
  let dis = this.pts[0].Distance(v);
  for (let i = 1, c = this.pts.length; i < c; ++i){
    let temp = this.pts[i].Distance(v);
    if (dis > temp){
      dis = temp;
      index = i;
    }
  }
  return this.pts[index];
}
NPolyline.prototype.GetCenterPt = function(){
    let pt = [0,0,0];
    let c = this.pts.length;
    for(var i =0; i < c; ++i){
        pt[0] += this.pts[i].x;
        pt[1] += this.pts[i].y;
        pt[2] += this.pts[i].z;
    }
    return modeling.entities.point([pt[0]/c,pt[1]/c,pt[2]/c]);
}
NPolyline.prototype.ToVecs = function(){
  let nvecs = [];
  for(let i = 0, c = this.pts.length; i < c ; ++i){
    nvecs.push(new NVector(this.pts[i].x, this.pts[i].y, this.pts[i].z));
  }
  return nvecs;
}
NPolyline.prototype.ComputeArea = function(){ // !!!!this doe not consider concave
  let area = 0.0;
  if(this.pts[0].Distance(this.pts[this.pts.length-1]) == 0){
    let cPt = this.GetCenterPt();
    let tempPts = this.pts;
    tempPts.push(new NVector(cPt.__data__.point[0], cPt.__data__.point[1], cPt.__data__.point[2]));
    for (let i = 0, c = tempPts.length; i < c - 4; ++i){
        let d0 = tempPts[c -1].Distance(tempPts[i]);
        let d1 = tempPts[c -1].Distance(tempPts[i + 1]);
        let d2 = tempPts[i].Distance(tempPts[i + 1]);
        area += this.GetAreaByThreeLength(d0, d1, d2);
    }
    return area;
  } else{
    for (let i = 0, c = tempPts.length; i < c - 3; ++i){
        let d0 = tempPts[c -1].Distance(tempPts[i]);
        let d1 = tempPts[c -1].Distance(tempPts[i + 1]);
        let d2 = tempPts[i].Distance(tempPts[i + 1]);
        area += this.GetAreaByThreeLength(d0, d1, d2);
    }
    return area;
  }
}
NPolyline.prototype.GetAreaByThreeLength = function(len1, len2, len3){   // using Heron's Formula
    let a = (len1 + len2 + len3) * 0.5;
    return Math.sqrt(a * (a - len1) * (a - len2) * (a - len3));
}
NPolyline.prototype.ComputeLength = function(){
  let totalLength = 0.0;
  for(let i = 0, c = this.pts.length; i < c -1 ; ++i){
    totalLength += this.pts[i+1].Distance(this.pts[i])
  }
  return totalLength;
}
NPolyline.prototype.ToPoint = function(){
  let nvecs = [];
  for(let i = 0, c = this.pts.length; i < c ; ++i){
    nvecs.push(modeling.entities.point([this.pts[i].x, this.pts[i].y, this.pts[i].z]));
  }
  return nvecs;
}
NPolyline.prototype.ToLine = function(){
  let nvecs = [];
  for(let i = 0, c = this.pts.length; i < c - 1 ; ++i){
    let p1 = modeling.entities.point([this.pts[i].x, this.pts[i].y, this.pts[i].z]);
    let p2 = modeling.entities.point([this.pts[i+1].x, this.pts[i+1].y, this.pts[i+1].z]);
    nvecs.push(modeling.entities.line(p1,p2));
  }
  return nvecs;
}
NPolyline.prototype.ToMesh = function(){
    let Vertices = this.ToPoint();
    let mesh = modeling.entities.mesh();
    if (this.pts[0].Distance(this.pts[this.pts.length -1]) == 0){
      for(let i = 0; i < Vertices.length -1; ++i) {
          mesh.vertex(Vertices[i]);
      }
      for(let j = 0; j < Vertices.length -3; ++j) {
          mesh.face(0, j+1, j+2);
      }
    }else{
      for(let i = 0; i < Vertices.length ; ++i) {
          mesh.vertex(Vertices[i]);
      }
      for(let j = 0; j < Vertices.length -2; ++j) {
          mesh.face(0, j+1, j+2);
      }
    }
    this.mesh = mesh;
    return mesh;
}
//////////////////////////////////////////////////////////////////////////////// static \
NPolyline.BuildWithVecs = function(vecs){
  var np = new NPolyline();
  for(let i = 0, c = vecs.length; i < c ; ++i){
    np.Add(new NVector(vecs[i].x, vecs[i].y, vecs[i].z));
  }
  return np;
}
NPolyline.BuildWithPoint = function(vecs){
  var np = new NPolyline();
  for(let i = 0, c = vecs.length; i < c ; ++i){
    //np.Add(new NVector(vecs[i].__data__.point[0], vecs[i].__data__.point[1], vecs[i].__data__.point[2] ));
    np.Add(new NVector(vecs[i].point[0], vecs[i].point[1], vecs[i].point[2] ));
  }
  return np;
}
NPolyline.BuildWithLine = function(vecs){
  var np = new NPolyline();
  for(let i = 0, c = vecs.length; i < c ; ++i){
    np.Add(new NVector(vecs[i].start[0], vecs[i].start[1], vecs[i].start[2]));
  }
  np.Closed();
  return np;
}
////////////////////////////////////////////////////////////////////////////// NVec

function NVector(_x,_y,_z){
    if(arguments.length == 0){
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
    if(arguments.length == 2){
        this.x = _x;
        this.y = _y;
        this.z = 0;        
    }    
    if(arguments.length == 3){
        this.x = _x;
        this.y = _y;
        this.z = _z; 
    }
};
NVector.prototype.ToString = function(){
    console.log("x: " + this.x + " , y: " + this.y +" , z: " + this.z);
};
NVector.prototype.Set = function(v){
    this.x = v.x; 
    this.y = v.y; 
    this.z = v.z;
    return NVector(this.x, this.y, this.z);
};
NVector.prototype.Scale = function(v){
    this.x *= v; 
    this.y *= v; 
    this.z *= v;
    return NVector(this.x, this.y, this.z);
};
NVector.prototype.Mult = function(v){
    this.x *= v; 
    this.y *= v; 
    this.z *= v;
    return NVector(this.x, this.y, this.z);
};
NVector.prototype.Div = function(v){
    this.x /= v; 
    this.y /= v; 
    this.z /= v;
    return NVector(this.x, this.y, this.z);
};
NVector.prototype.Add = function(v){
    this.x += v.x; 
    this.y += v.y; 
    this.z += v.z;
    return NVector(this.x, this.y, this.z);
};
NVector.prototype.Distance = function(v){
    return NVector.Distance(new NVector(this.x, this.y, this.z), v );
};
NVector.Distance = function(v1, v2){
    return (Math.abs(Math.sqrt(((v2.x - v1.x) * (v2.x - v1.x)) + ((v2.y - v1.y) * (v2.y - v1.y)) + ((v2.z - v1.z) * (v2.z - v1.z)))));
};
