'use strict';
var modeling = require('flux-modelingjs').modeling();
function run(Line, index ) {
	let lg = new NGraph()
	lg.AddNEdgeFromFluxLine(Line[0]);
	let ln = lg.GetEdgeInOrder();
 return {
      Lns: ln[index]
  };

}
module.exports = {
    run: run
};

function NGraph(){
    this.NEdges = [];
    this.NNodes = [];
}
NGraph.prototype.ToString = function(){
    return (" N: {" + this.NNodes.length + "}, E: {" + this.NEdges.length + "}");
}
NGraph.prototype.AddNEdgeFromFluxLine=function(lns){
    for (let i = 0, c = lns.length ; i < c ; i++) {
      let v1 = new NVector(lns[i][0].start[0], lns[i][0].start[1], lns[i][0].start[2]);
      let v2 = new NVector(lns[i][0].end[0], lns[i][0].end[1], lns[i][0].end[2]);
	  let n1 = new NNode(v1, this);
      let n2 = new NNode(v2, this);
      let e1 = new NEdge(n1, n2, this);
      this.NNodes.push(n1)
      this.NNodes.push(n2)
      this.NEdges.push(e1)
    }
}
//.................................................................Visualization
NGraph.prototype.GetLine=function(){
    let line = [];
    for(let i =0, c = this.NEdges.length; i < c; ++i){
		let v1 = this.NEdges[i].N1.vec;
		let v2 = this.NEdges[i].N2.vec;
		let ln = new NLine(v1, v2);
		line.push(ln);
    }
    return line;
}
NGraph.prototype.GetFluxLine=function(){
    let line = [];
    for(let i =0, c = this.NEdges.length; i < c; ++i){
		let v1 = this.NEdges[i].N1.vec;
		let v2 = this.NEdges[i].N2.vec;
		let ln = new NLine(v1, v2);
		line.push(ln.ToFluxLine());
    }
    return line;
}
NGraph.prototype.GetVecFromNode=function(){
  let vecs = [];
  for(let i =0, c = this.Nodes.length; i < c; ++i){
    vecs.Add(this.Nodes[i].vec);
  }
  return vecs;
}
//.................................................................NGraph Utility
NGraph.prototype.GetEdgeInOrder=function(){
  let temp = [];
  temp.push(this.NEdges[this.NEdges.length - 1]);
  temp[0].visit++;
  for(let i = 0; i < 100; ++i){
    let e = this.FindNeighborWtihEdge(temp[temp.length - 1]);
    if(e != null) temp.push(e);
  }
  return this.GetNLineFromEdge(temp); // temp;
}
NGraph.prototype.FindNeighborWtihEdge=function(e){
  for(let ee of this.NEdges ){
    if(this.IsNeighbor(e, ee)){
      if(ee.visit == 0){
        if(!this.IsIdenticalEdge(e, ee)){
          if(!this.IsOverlapEdge(e, ee)){
            ee.visit++;
            return ee;
          }
        }
      }
    }
  }
  return null;
}
NGraph.prototype.IsIdenticalEdge=function(e1, e2){
  if(e1 == e2 ) return true;
  if(e1.N1 == e2.N1 && e1.N2 == e2.N2 ) return true;
  if(e1.N1 == e2.N2 && e1.N2 == e2.N1 ) return true;
  return false;
}
NGraph.prototype.IsOverlapEdge=function( e1, e2){
  if((this.DistanceBetweenNodes(e1.N1, e2.N1) == 0 && this.DistanceBetweenNodes(e1.N2, e2.N2) == 0) ||
  (this.DistanceBetweenNodes(e1.N1, e2.N2) == 0 && this.DistanceBetweenNodes(e1.N2, e2.N1) == 0)) {
    return true;
  }
  return false;
}
NGraph.prototype.IsNeighbor=function( e1, e2){
  if((this.DistanceBetweenNodes(e1.N1, e2.N1) == 0 && this.DistanceBetweenNodes(e1.N2, e2.N2) != 0) ||
     (this.DistanceBetweenNodes(e1.N1, e2.N2) == 0 && this.DistanceBetweenNodes(e1.N2, e2.N1) != 0) ||
     (this.DistanceBetweenNodes(e1.N2, e2.N1) == 0 && this.DistanceBetweenNodes(e1.N1, e2.N2) != 0) ||
     (this.DistanceBetweenNodes(e1.N2, e2.N2) == 0 && this.DistanceBetweenNodes(e1.N1, e2.N1) != 0) ){
    return true;
  }
  return false;
}
NGraph.prototype.DistanceBetweenNodes=function(n1, n2){
	return n1.vec.Distance(n2.vec);
}
NGraph.prototype.GetNLineFromEdge=function(theEdge){
  let temp = []
  for(let i = 0, c = theEdge.length; i < c; ++i){
    temp.push(NEdge.ToFluxLine(theEdge[i]));
  }
  return temp;
}

//region creating NEdge
function NEdge(n1, n2, _graph){
    this.NGraph = _graph;
    this.visit = 0;
    this.N1 = n1; // first is itself
    this.N2 = n2; // second NNode is neighbor
    this.N1.NEdges.push(this);
    this.N2.NEdges.push(this);
}
NEdge.prototype.ToString = function(){
    return "the NEdge" + "N1: {" + this.N1.vec.ToString() + "}, N2: {" + this.N2.vec.ToString() + "}";
}
NEdge.ToFluxLine=function(edge){
	let p1 = modeling.entities.point([edge.N1.vec.x, edge.N1.vec.y, edge.N1.vec.z]);
	let p2 = modeling.entities.point([edge.N2.vec.x, edge.N2.vec.y, edge.N2.vec.z]);
	return modeling.entities.line(p1,p2);
}
//#endregion NEdge

//egion creating NNode 
function NNode(_v, _graph){
	this.vec = _v;
    this.NEdges = [];
    this.NGraph = _graph
}
NNode.prototype.GetNeighbours = function(){
    let listNode = [];
    for(let i = 0, c = this.listNEdges.length; i < c; ++i){
        if (this.listNEdges.N1 == this && this.listNEdges.N2 == this) continue;
        if (this.listNEdges.N1 == this) listNode.push(this.listNEdges.N2);
        else this.listNEdges.push(this.listNEdges.N1);
    }
    return nn;
}
NNode.prototype.ToString = function(){
    return "the Vec is " + ": {" + this.vec + "}";
}
//endregion NNode

function NLine(v1, v2){
	this.ptStart = v1 ===undefined ? [0,0,0] : v1;
	this.ptEnd = v2 ===undefined ? null : v2;
};
NLine.prototype.ToFluxLine = function(){
	let p1 = modeling.entities.point([this.ptStart.x, this.ptStart.y, this.ptStart.z]);
	let p2 = modeling.entities.point([this.ptEnd.x, this.ptEnd.y, this.ptEnd.z]);
	return modeling.entities.line(p1,p2);
};

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
NVector.prototype.Distance = function(v){
    return NVector.Distance(new NVector(this.x, this.y, this.z), v );
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////// converter functions
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
NVector.Distance = function(v1, v2){
    return (Math.abs(Math.sqrt(((v2.x - v1.x) * (v2.x - v1.x)) + ((v2.y - v1.y) * (v2.y - v1.y)) + ((v2.z - v1.z) * (v2.z - v1.z)))));
};

