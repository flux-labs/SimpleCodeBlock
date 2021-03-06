'use strict';
var modeling = require('flux-modelingjs').initialize().modeling;

function run(Points, Closed, Num) {
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
      Cpt : np.GetCenterPt(),
      Grid : NVector.ToFluxForList(np.GetVectorGridbyOptimizationWithDistance(Num)),
      IterNum : np.numberForIter
  };
}
module.exports = {
    run: run
};


function NPolyline(){
  this.pts = [];
  this.isClosed = true;
  this.mesh = null;
  this.numberForIter = 0; // this show how many iteration that you did to meet the opimal num.
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
NPolyline.prototype.ToString = function(){
  if(this.isClosed) return "this is a closed ployline, and the length is " + this.ComputeLength() + ", and the area is " + this.ComputeArea() + ", and it has " + this.pts.Count + " points." ;
  else return "this is a open ployline, and the length is " + this.ComputeLength() + ", and it has " + this.pts.Length + " points." ;
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
  if(this.pts[0].Distance(this.pts[this.pts.length-1]) == 0){
    let c = this.pts.length;
    for(var i =0; i < c; ++i){
        pt[0] += this.pts[i].x;
        pt[1] += this.pts[i].y;
        pt[2] += this.pts[i].z;
    }
    return modeling.entities.point([pt[0]/c-1,pt[1]/c-1,pt[2]/c-1]);
  }else{
    let c = this.pts.length;
    for(var i =0; i < c; ++i){
        pt[0] += this.pts[i].x;
        pt[1] += this.pts[i].y;
        pt[2] += this.pts[i].z;
    }
    return modeling.entities.point([pt[0]/c,pt[1]/c,pt[2]/c]);
  }
}

NPolyline.prototype.GetVectorGridbyOptimizationWithDistance=function(targetNum){
    let vecs = []
    let vecBound = this.GetBoundingBox();

    let resDistance = (vecBound.pts[1].x - vecBound.pts[0].x) / 10;

    // tolerance
    let numTor = targetNum * 0.1;
    let numTorForStep = 0.000005;

    let numForTotalLoop = 0;
    while (numForTotalLoop < 100)
    {
        this.numberForIter = numForTotalLoop;
        vecs = this.GetVectorGridByDis(resDistance);
        if (targetNum < vecs.length)
        {
            let numInrease = 0.1 + ((vecs.length - targetNum) * numTorForStep);

            resDistance += numInrease;
        }
        else if (vecs.length < targetNum)
        {
            let numInrease = 0.1 + ((vecs.length - targetNum) * numTorForStep);
            resDistance -= numInrease;
        }
        if (vecs.length < targetNum + numTor && vecs.length > targetNum - numTor) break;
        numForTotalLoop++;
    }

    return vecs;
}
NPolyline.prototype.GetVectorGridByDis=function(distance){
    if (distance < 0.05) distance = 0.05; 
    let vecs = [];

    let vecBound = this.GetBoundingBox();
    let p1 = vecBound.pts[0];
    let p2 = vecBound.pts[2];

    let xTotal = (p2.x - p1.x);
    let yTotal = (p2.y - p1.y);

    let xNumForLoop = xTotal / distance;
    let yNumForLoop = yTotal / distance;

    let xOff = distance * 0.5;
    let yOff = distance * 0.5;

    for (let y = 0; y < yNumForLoop; ++y)
    {
        for (let x = 0; x < xNumForLoop; ++x)
        {
            let v = new NVector(p1.x + xOff + (x * distance), p1.y + yOff + (y * distance), 0);
            if (this.IsInside(v)) vecs.push(v);
            // vecs.push(v);
        }
    }
    return vecs;
}
NPolyline.prototype.IsInside=function(v){
    var x = v.x, y = v.y;
    var inside = false;
    this.Open();
    for (var i = 0, j = this.pts.length - 1; i < this.pts.length; j = i++){
        var xi = this.pts[i].x, yi = this.pts[i].y;
        var xj = this.pts[j].x, yj = this.pts[j].y;
        var intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
    // return true;
}
NPolyline.prototype.GetBoundingBox=function(){
    if (this.pts.length == 0){
        return null;
    }
    let pl = new NPolyline();
    let min = new NVector(this.pts[0].x, this.pts[0].y, this.pts[0].z);
    let max = new NVector(this.pts[0].x, this.pts[0].y, this.pts[0].z);
    for (let i = 0, c = this.pts.length; i < c; ++i){
        if (min.x > this.pts[i].x) min.x = this.pts[i].x;
        if (max.x < this.pts[i].x) max.x = this.pts[i].x;

        if (min.y > this.pts[i].y) min.y = this.pts[i].y;
        if (max.y < this.pts[i].y) max.y = this.pts[i].y;

        if (min.z > this.pts[i].z) min.z = this.pts[i].z;
        if (max.z < this.pts[i].z) max.z = this.pts[i].z;
    }
    pl.Add(min);
    pl.Add(new NVector(min.x, max.y, 0));
    pl.Add(max);
    pl.Add(new NVector(max.x, min.y, 0));
    return pl;
}

NPolyline.prototype.ComputeArea = function(){ // !!!!this doe not consider concave
  let area = 0.0;
  if(this.pts[0].Distance(this.pts[this.pts.length-1]) == 0){
    let cPt = this.GetCenterPt();
    let tempPts = this.pts;
    tempPts.push(new NVector(cPt.__data__.point[0], cPt.__data__.point[1], cPt.__data__.point[2]));
    for (let i = 0, c = tempPts.length; i < c - 2; ++i){
        let d0 = tempPts[c -1].Distance(tempPts[i]);
        let d1 = tempPts[c -1].Distance(tempPts[i + 1]);
        let d2 = tempPts[i].Distance(tempPts[i + 1]);
        area += this.GetAreaByThreeLength(d0, d1, d2);
    }
    return area;
  } else{
 
    return "it need to be closed to compute the area."
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
NPolyline.prototype.ToVecs = function(){
  let nvecs = [];
  for(let i = 0, c = this.pts.length; i < c ; ++i){
    nvecs.push(new NVector(this.pts[i].x, this.pts[i].y, this.pts[i].z));
  }
  return nvecs;
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
  
  if(vecs[0].primitive === "polyline"){
    vecs[0].points.forEach(function(pt){
      console.log(pt);
      np.Add(new NVector(pt[0], pt[1], pt[2] ));
    })  
  }else{
    for(let i = 0, c = vecs.length; i < c ; ++i){
    //np.Add(new NVector(vecs[i].__data__.point[0], vecs[i].__data__.point[1], vecs[i].__data__.point[2] ));
      np.Add(new NVector(vecs[i].point[0], vecs[i].point[1], vecs[i].point[2] ));
    }
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
NVector.FromFluxPoint=function(p){
  return new NVector(p.point[0], p.point[1], p.point[2] );
}
NVector.ToFluxForList = function(vecs){
  let FPts = [];
  for(let i =0, c = vecs.length; i < c; ++i){
    FPts.push(modeling.entities.point([vecs[i].x, vecs[i].y, vecs[i].z]));
  }
  return FPts;
}