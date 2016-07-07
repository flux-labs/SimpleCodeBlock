'use strict';
var modeling = require('flux-modelingjs').modeling();
function run( data, scale, width, height, point, circular, flip  ) {
    if (width < 10) width = 10;
    if (height < 10) height = 10;
    let dVis = new NDataVis(data, width, height);
    dVis.origin = new NVector(point.point[0] - width * 0.5, point.point[1] - height * 0.5, point.point[2]);
    if (scale < 1) dVis.scale = 1;
    else dVis.scale = scale;

    let ln = [];
    let cir = [];
    
    if (!circular){
        if (flip){
            dVis.InitForBarChartY();
            ln = NLine.GetFluxLinesFromNLines(dVis.VisForBarChartY());
        }else{
            dVis.InitForBarChartX();
            ln = NLine.GetFluxLinesFromNLines(dVis.VisForBarChartX());
        }
    }
    if (circular){
        dVis.InitForCircularChart();
        if (flip){
            ln = NLine.GetFluxLinesFromNLines(dVis.GetLineByRemapDataToPolarFlip());
            cir = dVis.GetCircleFromMinMax();
        }else{
            ln = NLine.GetFluxLinesFromNLines(dVis.GetLineByRemapDataToPolar());
            cir = dVis.GetCircleFromMinMax();
        }
    }
  return {
      Ln: ln,
      Cir: cir
  };
}
module.exports = {
    run: run
};
function NDataVis( _data, _width, _height){
    this.data = _data;
    this.height = _height;
    this.width = _width;
    this.origin = NVector.Origin();
    this.resX = 0.0;
    this.resY = 0.0;
    this.scale = 1.0;
    this.intervalX = 0.0;
    this.intervalY = 0.0;
    this.domainX = [];
    this.domainY = [];
    this.domain = []; // for circular one
}
////////////////////////////// bar chart
NDataVis.prototype.InitForBarChartX=function(){
    this.domainX[0] = 0;
    this.domainX[1] = this.data.length;
    this.domainY = NDataVis.GetDomain(this.data);
}
NDataVis.prototype.VisForBarChartX=function(){
    let nLine = [];
    this.intervalX = this.width /this.domainX[1];
    this.domainY = NDataVis.GetDomain(this.data);
    for (let i = 0; i < this.domainX[1]; i++){
        let x = this.origin.x + this.intervalX * i;
        let y = this.origin.y;
        let offsetY = NDataVis.Remap(this.data[i], this.domainY[0], this.domainY[1], this.origin.y, this.origin.y + this.height);
        nLine.push(new NLine(new NVector(x, y, 0), new NVector(x, offsetY, 0)));
    }
    return nLine;
}
NDataVis.prototype.InitForBarChartY=function(){
    this.domainY[0] = 0;
    this.domainY[1] = this.data.length;
    this.domainX = NDataVis.GetDomain(this.data);
}
NDataVis.prototype.VisForBarChartY=function(){
    let nLine = [];
    this.intervalY = this.height / this.domainY[1];
    this.domainX = NDataVis.GetDomain(this.data);
    for (let i = 0, c = this.domainY[1]; i < c; ++i){
        let x = this.origin.x;
        let y = (this.origin.y - this.intervalY * i) + this.height;
        let offsetX = NDataVis.Remap(this.data[i], this.domainX[0], this.domainX[1], this.origin.x, this.origin.x + this.width);
        nLine.push(new NLine(new NVector(x, y, 0), new NVector(offsetX, y, 0)));
    }

    return nLine;
}
NDataVis.prototype.GetLegendForBarChart = function(){
    let p1 = new NVector(this.origin.x, this.origin.y, 0);
    let p2 = new NVector(this.origin.x + this.width, this.origin.y, 0);
    let p3 = new NVector(this.origin.x, this.origin.y + this.height, 0);
    return null;
}
////////////////////////////// end bar chart

////////////////////////////// bar chart
NDataVis.prototype.InitForCircularChart = function(){
    this.domain = NDataVis.GetDomain(this.data);
    this.origin = new NVector(this.origin.x + (this.width * 0.5), this.origin.y + (this.height * 0.5), 0);
}
NDataVis.GetLineByRemapDataToCarte = function( data, p, scale, width, height){ // static method // VisDataToCarteCoord
    let lns = [];
    this.resX = this.data.length; // num for div Radius
    let kInterval = ((3.14159 * 2) - 0.0) / xRes;
    for (let j = 0; j < xRes; j++){
        let angle = kInterval * j;
        let radius = scale * data[j];
        let y = radius * (Math.sin(angle));
        let x = radius * (Math.cos(angle));
        let p2 = new NVector(x + p.x, y + p.y, 0 + p.z);
        ns.push(new NLine(p, p2));
    }
    return lns;
}
NDataVis.prototype.GetLineByRemapDataToPolar = function(){
    let nLine = [];
    this.resX = this.data.length; // num for div Radius
    let kInterval = ((3.14159 * 2) - 0.0) / this.resX;
    for (let j = 0; j < this.resX; j++){
        let angle = kInterval * j;
        let radius = this.scale * this.data[j];
        let y = radius * (Math.sin(-angle));
        let x = radius * (Math.cos(-angle));
        let p2 = new NVector(x + this.origin.x, y + this.origin.y, 0 + this.origin.z);
        nLine.push(new NLine(new NVector(this.origin.x, this.origin.y, this.origin.z), new NVector(p2.x, p2.y, p2.z)));
    }
    return nLine;
}
NDataVis.prototype.GetLineByRemapDataToPolarFlip = function(){
    let nLine = [];
    this.resX = this.data.length; // num for div Radius
    let kInterval = ((3.14159 * 2) - 0.0) / this.resX;
    for (let j = 0; j < this.resX; j++){
        let angle = kInterval * j;
        let radius = this.scale * this.data[j];
        let y = radius * (Math.sin(angle));
        let x = radius * (Math.cos(angle));
        let p2 = new NVector(x + this.origin.x, y + this.origin.y, 0 + this.origin.z);
        nLine.push(new NLine(new NVector(this.origin.x, this.origin.y, this.origin.z), new NVector(p2.x, p2.y, p2.z)));
    }
    return nLine;
}
NDataVis.prototype.GetCircleFromMinMax = function(){
    let cir = [];
    let pt = modeling.entities.point([this.origin.x , this.origin.y , this.origin.z]);
    cir.push( modeling.entities.circle( pt, this.domain[0] * this.scale))
    cir.push( modeling.entities.circle( pt, this.domain[1] * this.scale))
    return cir;
}
NDataVis.prototype.GetLegendForCircleVis = function(){
    let p = new NVector(this.origin.x + this.width * 0.5, this.origin.y + this.height, 0);
    return null;
}
//////////////////////////////////////////////////////////////////// static method
NDataVis.GetDomain = function(doubleList){
    let domain = [];
    domain.push(doubleList[0]);
    domain.push(doubleList[0]);
    for(let i = 0, c = doubleList.length; i < c; ++i){
        if (domain[0] > doubleList[i]){
            domain[0] = doubleList[i];
        }
        if (domain[1] < doubleList[i]){
            domain[1] = doubleList[i];
        }
    }
    return domain;
}
NDataVis.Remap = function(CValue, OldMin, OldMax, NewMin, NewMax){
    return (((CValue - OldMin) * (NewMax - NewMin)) / (OldMax - OldMin)) + NewMin;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////// end NDataVis class


///////////////////////////////////////////////////////////////////////////////////////////////////////// extra utility
function NLine( _v1, _v2){
    this.ptStart = _v1;
    this.ptEnd = _v2;
}
NLine.prototype.ToFlux = function(){
    //return new Rhino.Geometry.Line(new Point3d(ptStart.X, ptStart.Y, ptStart.Z), new Point3d(ptEnd.X, ptEnd.Y, ptEnd.Z));
}
NLine.GetFluxLinesFromNLines = function(lns){
    let temp = [];
    for(let i = 0, c = lns.length; i < c; ++i){
        let v0 = modeling.entities.point([lns[i].ptStart.x, lns[i].ptStart.y, lns[i].ptStart.z]);
        let v1 = modeling.entities.point([lns[i].ptEnd.x, lns[i].ptEnd.y, lns[i].ptEnd.z]);
        temp.push(modeling.entities.line(v0, v1));
    }
    return temp;
}
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
NVector.Origin = function(){
    return new NVector(0,0,0);
}
