'use strict';
var modeling = require('flux-modelingjs').modeling();
var _ = require('lodash');
function run(Polyline, Angle, xSpan, ySpan, xOff, yOff, remap ) {
	//////////////////////////////////////////////////////////////////////////// Grid optimizer

    var gc = new GridCell();
    
    gc.widthCell = xSpan; 
    gc.lengthCell = ySpan;  
    gc.remapCoordinate = remap;

    gc.Init(Polyline);
    gc.xBuffer = xOff;
    gc.yBuffer = yOff;
    gc.Optimize(40, Angle);
    
	return {
			boundary: gc.GetPolylineForSite().ToFluxLine(),  // ToFluxLine() // ToFluxMesh();
			Pts: gc.ptsGird.ToFluxPoint(),
			NumPts: gc.GetNumPts()
			};
};
module.exports = {
    run: run
};

///////////////////////////////////////////////////////////////////////////////// CellGraph class
var geo = [];
function AddGeoForVisFlux(d){
	for(let i = 0, c = d.length; i < c; ++i){
		geo.push(d[i]);
	}
}

///////////////////////////////////////////////////////////////////////////////// GridCell class
function GridCell(){
    this.listPtsForSite = [];
    
    this.ptToLocalCenter = null;
    this.ptToWorldCenter = null;
    
    this.plineSite = null;
    this.plineBoundary = null;

    this.widthCell = 2; // for triple car parks
    this.lengthCell = 2;  // STANDARD_SPAN
    this.distanceDeck = 0.0;
    this.xBuffer = 2;
    this.yBuffer = 5;

    this.ptEntry = NVector.Origin();
    this.ptPreviOrigin = NVector.Origin();
    this.listAngles = null;
    
    this.ptsGird = [];
    
    this.listPtsForCenterGrid = [];
    this.listPtsForCenterBoundary = [];
    this.listPtsForCenterSite = [];
}
///////////////////////////////////////////////////////////////////////////////// build
GridCell.prototype.Init = function(pl){
    this.lengthCell += this.distanceDeck;
    
	this.plineSite = NPolyline.BuildWithFLine(pl);
	this.plineBoundary = NPolyline.BuildWithVecs(NJS.GetBoundaryFromVecs(this.plineSite.ToVecs()));
    
    this.ptToLocalCenter = this.plineSite.GetCenterPt();
    this.ptToWorldCenter = new NVector(-this.ptToLocalCenter.x, -this.ptToLocalCenter.y, -this.ptToLocalCenter.z)
    
    // remap the pos to center
    this.listPtsForCenterGrid = NVector.MoveVecs(this.plineBoundary.ToVecs(), this.ptToWorldCenter); // move to origin [0,0,0]
    this.listPtsForCenterSite = NVector.MoveVecs(this.plineSite.ToVecs(), this.ptToWorldCenter);
	this.ptEntry = NVector.MoveVec(this.ptEntry, this.ptToWorldCenter);
    
};
///////////////////////////////////////////////////////////////////////////////// optimizaion
GridCell.prototype.Optimize = function(resolusion, debug = 0){
	this.ComputeListOfAngle(resolusion);

  //for(let theAngle = 0, c = this.listAngles.length; theAngle < c; ++theAngle){
  //  this.RotateSite(this.listAngles[theAngle]);
  //}
  if(debug != null) this.RotateSite(debug);

  this.GetGird();
};
GridCell.prototype.ComputeListOfAngle = function(resolusion){
  this.listAngles = [];
  var res = 3.14159265358979 * 2 / resolusion;
  for(var i = 0; i <= resolusion; ++i) {
    this.listAngles.push(res * i);
  }
};
GridCell.prototype.RotateSite = function(angle){
  this.listPtsForSite = NVector.RotateVecs(this.listPtsForCenterSite, angle);
  this.ptEntry = NVector.RotateVec(this.ptEntry, angle);
  this.listPtsForCenterBoundary = NJS.GetBoundaryFromVecs(this.listPtsForSite);
}
GridCell.prototype.GetGird = function(){
  let xDis = this.listPtsForCenterBoundary[2].x - this.listPtsForCenterBoundary[0].x;
  let yDis = this.listPtsForCenterBoundary[2].y - this.listPtsForCenterBoundary[0].y;
  let xStep = (xDis / this.widthCell);
  let yStep = (yDis / this.lengthCell);
  let xD = xDis / xStep;
  let yD = yDis / yStep;
  this.ptsGird = [];
  for(let  j = 0; j <= yStep; ++j){
    for(let  i = 0; i <= xStep; ++i){
      let  p = new NVector(this.listPtsForCenterBoundary[0].x + this.xBuffer + i * xD, this.listPtsForCenterBoundary[0].y + this.yBuffer + j * yD, this.listPtsForCenterBoundary[0].z + 0);
      if(NVector.IsInsideOfVecs(p, this.listPtsForSite)){ 
      	this.ptsGird.push(p);
      }
    }
  }
}
///////////////////////////////////////////////////////////////////////////////// visualization
GridCell.prototype.GetPolylineForBoundary = function(){
  return NPolyline.BuildWithVecs(this.listPtsForCenterBoundary);
}
GridCell.prototype.GetCenterPt = function(){
  return this.ptForCenter;
}
GridCell.prototype.GetPolylineForSite = function(){
  return NPolyline.BuildWithVecs(this.listPtsForSite);
}
GridCell.prototype.GetEntryPt = function(){
  return new NVector(this.ptEntry.x, this.ptEntry.y, this.ptEntry.z);
}
GridCell.prototype.RemapTranslationForNVec = function(v1){
  let v = new NVector(v1.x, v1.y, v1.z);
  if(this.remapCoordinate){
    v = NVector.RotateVec(v, NJS.Radians(-this.angle));
    v = NVector.MoveVec(v, this.ptToLocalCenter);
  }
  return v;
}
GridCell.prototype.RemapTranslationForNVecs = function(vecs){
  let temp = [];
  for(let i = 0, c = vecs.length; i < c; ++i){
    let v = null;
    if(this.remapCoordinate) v = this.RemapTranslationForNVec(vecs[i]);
    else v = vecs[i];
    temp.push(v);
  }
  return temp;
}
GridCell.prototype.GetNumPts = function(){
	console.log(this.ptsGird.length);
  return this.ptsGird.length;
}

///////////////////////////////////////////////////////////////////////////////// end GridCell class



//////////////////////////////////////////////////////////////////////////////// dependent classes
//////////////////////////////////////////////////////////////////////////////// 
//////////////////////////////////////////////////////////////////////////////// 
//////////////////////////////////////////////////////////////////////////////// 

//////////////////////////////////////////////////////////////////////////////// NPolyline class
function NPolyline(){
  this.pts = [];
  this.isClosed = true;
  this.mesh = null;
  this.ptCenter = null;
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
NPolyline.prototype.Translate = function(v){
	let vecs = []
	for(let i = 0, c = this.pts.length; i < c ; ++i ){
		vecs.push(new NVector(this.pts[i].x + v.x, this.pts[i].y + v.y, this.pts[i].z + v.z));
	}
	this.pts = vecs;
	return this;
}
NPolyline.prototype.GetClosedPtFromPt = function(v){
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
NPolyline.prototype.GetCenterPt = function(v){
	if(this.pts[0].Distance(this.pts[this.pts.length -1]) == 0){
	  let nv = new NVector(0,0,0);
	  for(let i = 0, c = this.pts.length-1; i < c; ++i){
	    nv.Add( this.pts[i]);
	  }
	  nv.Mult( 1.0 / (this.pts.length-1));
	  
	  this.ptCenter = nv;
	  return nv;
	}else{
	  let nv = new NVector(0,0,0);
	  for(let i = 0, c = this.pts.length; i < c; ++i){
	    nv.Add( this.pts[i]);
	  }
	  nv.Mult( 1.0 / this.pts.length);
	  this.ptCenter = nv;
	  return nv;
	}
}
NPolyline.prototype.ToVecs = function(){
  let nvecs = [];
  for(let i = 0, c = this.pts.length; i < c ; ++i){
    nvecs.push(new NVector(this.pts[i].x, this.pts[i].y, this.pts[i].z));
  }
  return nvecs;
}
NPolyline.prototype.ComputeArea = function(){
  if(this.isClosed || this.pts[0].Distance(this.pts[this.pts.length-1]) == 0){
    let area = 0.0;
    return area;
  }
  return "Cannot compute it (This is not a cloased polyline)"
}
NPolyline.prototype.ComputeLength = function(){
  let totalLength = 0.0;
  for(let i = 0, c = this.pts.length; i < c -1 ; ++i){
    totalLength += this.pts[i+1].Distance(this.pts[i])
  }
  return totalLength;
}
NPolyline.prototype.ToFluxPoint = function(){
  let nvecs = [];
  for(let i = 0, c = this.pts.length; i < c ; ++i){
    nvecs.push(modeling.entities.point([this.pts[i].x, this.pts[i].y, this.pts[i].z]));
  }
  return nvecs;
}
NPolyline.prototype.ToFluxLine = function(){
  let nvecs = [];
  for(let i = 0, c = this.pts.length; i < c - 1 ; ++i){
    let p1 = modeling.entities.point([this.pts[i].x, this.pts[i].y, this.pts[i].z]);
    let p2 = modeling.entities.point([this.pts[i+1].x, this.pts[i+1].y, this.pts[i+1].z]);
    nvecs.push(modeling.entities.line(p1,p2));
  }
  return nvecs;
}
NPolyline.prototype.ToFluxMesh = function(){
  let Vertices = this.ToFluxPoint();
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
//////////////////////////////////////////////////////////////////////////////// static 
NPolyline.BuildWithVecs = function(vecs){
  var np = new NPolyline();
  for(let i = 0, c = vecs.length; i < c ; ++i){
    np.Add(new NVector(vecs[i].x, vecs[i].y, vecs[i].z));
  }
  return np;
}
NPolyline.BuildWithFPoint = function(vecs){
  var np = new NPolyline();
  for(let i = 0, c = vecs.length; i < c ; ++i){
    np.Add(new NVector(vecs[i].point[0], vecs[i].point[1], vecs[i].point[2] ));
  }
  return np;
}
NPolyline.BuildWithFLine = function(vecs){
  var np = new NPolyline();
  for(let i = 0, c = vecs.length; i < c ; ++i){
    np.Add(new NVector(vecs[i].start[0], vecs[i].start[1], vecs[i].start[2] ));
  }
  return np;
}
//////////////////////////////////////////////////////////////////////////////// end NPolyline class


//////////////////////////////////////////////////////////////////////////////// NLine
function NLine(v1, v2){
	this.ptStart = v1 ===undefined ? [0,0,0] : v1;
	this.ptEnd = v2 ===undefined ? null : v2;
};
NLine.prototype.ToFluxLine = function(){
	let p1 = modeling.entities.point([this.ptStart.x, this.ptStart.y, this.ptStart.z]);
	let p2 = modeling.entities.point([this.ptEnd.x, this.ptEnd.y, this.ptEnd.z]);
	return modeling.entities.line(p1,p2);
};


//////////////////////////////////////////////////////////////////////////////// NVector Utility
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
    return new NVector(this.x, this.y, this.z);
};
NVector.prototype.Scale = function(v){
    this.x *= v; 
    this.y *= v; 
    this.z *= v;
    return new NVector(this.x, this.y, this.z);
};
NVector.prototype.Mult = function(v){
    this.x *= v; 
    this.y *= v; 
    this.z *= v;
    return new NVector(this.x, this.y, this.z);
};
NVector.prototype.Div = function(v){
    this.x /= v; 
    this.y /= v; 
    this.z /= v;
    return new NVector(this.x, this.y, this.z);
};
NVector.prototype.Add = function(v){
    this.x += v.x; 
    this.y += v.y; 
    this.z += v.z;
    return new NVector(this.x, this.y, this.z);
};
NVector.prototype.Sub = function(v){
    this.x -= v.x; 
    this.y -= v.y; 
    this.z -= v.z;
    return NVector(this.x, this.y, this.z);
};
NVector.prototype.Length = function(){
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
};
NVector.prototype.Normalize = function(){
    var len = Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
    this.x = this.x / len; 
    this.y = this.y / len; 
    this.z = this.z / len;
    return NVector(this.x, this.y, this.z);
};
NVector.prototype.Distance = function(v){
    return NVector.Distance(new NVector(this.x, this.y, this.z), v );
};
NVector.prototype.Distance2 = function(v){
    return NVector.Distance2(new NVector(this.x, this.y, this.z), v );
};
NVector.prototype.DotProduct = function(v){
    return NVector.DotProduct(new NVector(this.x, this.y, this.z), v );
};
NVector.prototype.CrossProduct = function(v){
    return NVector.CrossProduct(new NVector(this.x, this.y, this.z), v );
};
NVector.prototype.SquareLength = function(){
    var len = NVector.Length(new NVector(x,y,z));
    return len * len;
};
NVector.prototype.FadeExp = function(attr, dVal){
    var v = new NVector(this.x,this.y,this.z);
    v.Sub(attr);
    return Math.exp(-dVal * v.SquareLength());
};
NVector.prototype.ToFlux = function(){
  let p = {
            "point":[this.v.x , this.v.y, this.v.z],
            "primitive": "point",
            "units": {
              "point": "meters"
          }
  }
  return p;
}
NVector.prototype.ToFluxPoint = function(){
  return modeling.entities.point([this.x, this.y, this.z]);
}
Array.prototype.ToFluxPoint = function(){
  let FPts = [];
  for(let i =0, c = this.length; i < c; ++i){
  	FPts.push(modeling.entities.point([this[i].x, this[i].y, this[i].z]));
  }
  return FPts;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////// static functions
NVector.zAxis = function(){
  return new NVector(0,0,1);
};
NVector.zero = function(){
  return new NVector(0,0,0);
};
NVector.Origin = function(){
  return new NVector(0,0,0);
};
NVector.push = function(v1, v2){
    return new NVector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
};
NVector.Length = function(v){
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
};
NVector.Normalize = function(v){
    var len = Math.sqrt((v.x * v.x) + (v.y * v.y) + (v.z * v.z));
    var nv = new NVector(v.x / len , v.y / len, v.z / len);
    return nv;
};
NVector.Distance = function(v1, v2){
    return (Math.abs(Math.sqrt(((v2.x - v1.x) * (v2.x - v1.x)) + ((v2.y - v1.y) * (v2.y - v1.y)) + ((v2.z - v1.z) * (v2.z - v1.z)))));
};
NVector.Distance2 = function(v1, v2){
    var d = ((v1.x - v2.x) * (v1.x - v2.x) + (v1.y - v2.y) * (v1.y - v2.y) + (v1.z - v2.z) * (v1.z - v2.z));
    return d;
};
NVector.DotProduct = function(v1, v2){
    return  v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
};
NVector.CrossProduct = function(v1, v2){
    return new NVector( v1.y * v2.z - v1.z * v2.y , v1.z * v2.x - v1.x * v2.z , v1.x * v2.y - v1.y * v2.x);
};
NVector.ToFlux = function(v){
  var p = {
            "point": [],
            "primitive": "point",
            "units": {
              "point": "meters"
          }
  }
  p.point = [v.x , v.y, v.z];
  return p;
}
NVector.ToFluxForList = function(vecs){
  let FPts = [];
  for(let i =0, c = vecs.length; i < c; ++i){
  	FPts.push(modeling.entities.point([vecs[i].x, vecs[i].y, vecs[i].z]));
  }
  return FPts;
}  
NVector.IsInsideOfVecsWtihVecs = function( vs, vecs) {
    var inside = true;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      inside = NVector.IsInsideOfVecs(vs[i], vecs);
      if(!inside) return false;
    }
    return true;
}
NVector.IsInsideOfVecs = function(v, vecs) {
  let x = v.x, y = v.y;
  let inside = false;
  for (let i = 0, j = vecs.length - 1; i < vecs.length; j = i++) {
    let xi = vecs[i].x, yi = vecs[i].y;
    let xj = vecs[j].x, yj = vecs[j].y;
    let intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

//////////////////////////////////////////////////////////////////////////////// translation Utility
NVector.MoveVecs = function(vecs, dir){
	let temp = [];
	for(let i = 0; i < vecs.length; ++i ){ //
	  temp.push(NVector.MoveVec(vecs[i], dir));
	}
	return temp;
}
NVector.MoveVec = function(v, dir){
	return new NVector(v.x + dir.x, v.y + dir.y, v.z + dir.z);
}
NVector.RotateVecsLoal = function(vecs, angle){
  var cptToLocal = GetCenterVecFromVecs(vecs);
  var cptToWorld = new NVector(-cptToLocal.x, -cptToLocal.y, -cptToLocal.z);
  var temp = NVector.MoveVecs(vecs, cptToWorld)
  temp = NVector.RotateVecs(temp, angle);
  temp = NVector.MoveVecs(temp, cptToLocal)
  return temp;
}
NVector.RotateVecs = function(vecs, angle){
	let temp = [];
	for(let i = 0; i < vecs.length; ++i ){
	  temp.push(NVector.RotateVec(vecs[i], angle));
	}
	return temp;
}
NVector.RotateVec = function(v, angle){
	let cos = Math.cos(angle * (3.14159265358979 / 180.0));
	let sin = Math.sin(angle * (3.14159265358979 / 180.0));
	let x = v.x * cos - v.y * sin;
	let y = v.x * sin + v.y * cos;
	return new NVector(x, y, v.z);
};
//////////////////////////////////////////////////////////////////////////////// end NVector Utility






//////////////////////////////////////////////////////////////////////////////// utility

var NJS=NJS || {};

NJS.Radians = function( degrees) {
  return (degrees * (3.14159265358979 / 180.0)); 
}
NJS.Degrees = function(radians){
  return (radians * (180.0 / 3.14159265358979 ));
}
NJS.GetBoundaryFromVecs = function(pts){
  let boundaryPts = [];
  let p1 = NVector.Origin();
  let p2 = NVector.Origin();
  for(let i = 0, c = pts.length; i < c; ++i){
    if(i == 0){
      p1 = new NVector(pts[i].x, pts[i].y, pts[i].z);
      p2 = new NVector(pts[i].x, pts[i].y, pts[i].z);
    }
    if(p1.x > pts[i].x) p1.x = pts[i].x;
    if(p1.y > pts[i].y) p1.y = pts[i].y;
    if(p1.z > pts[i].z) p1.z = pts[i].z;
    if(p2.x < pts[i].x) p2.x = pts[i].x;
    if(p2.y < pts[i].y) p2.y = pts[i].y;
    if(p2.z < pts[i].z) p2.z = pts[i].z;
  }
  boundaryPts.push(p1);
  boundaryPts.push(new NVector(p2.x, p1.y, p1.z));
  boundaryPts.push(p2);
  boundaryPts.push(new NVector(p1.x, p2.y, p2.z));
  return boundaryPts;
};
NJS.GetCenterVecFromVecs = function(vecs) {
  let nv = new NVector();
  for(let i = 0, c = vecs.length; i < c; ++i){
    nv.Add(vecs[i]);
  }
  nv.Mult( 1.0 / vecs.length);
  return nv;
}; 
NJS.GetPtsFromPolyline = function(pl){
  let temp = [];
  for(let i = 0, c = pl.length; i < c ; ++i){
    temp.push(new NVector(pl[i].start[0],pl[i].start[1], pl[i].start[2]));
  }
  return temp;
};




