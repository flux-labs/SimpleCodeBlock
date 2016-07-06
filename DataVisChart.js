'use strict';
var modeling = require('flux-modelingjs').modeling();
function run( data, width, height, point, circular, flip ) {

    if (width < 10) width = 10;
    if (height < 10) height = 10;
    NDataVis dVis = new NDataVis(data, width, height);
    dVis.origin = new NVector(p.X, p.Y, p.Z);

    if (!circular)
    {
        if (flip)
        {
            dVis.InitForBarChartY();
            DA.SetDataList(0, NLine.GetRhinoLinesFromNLines(dVis.VisForBarChartY()));
        }
        else
        {
            dVis.InitForBarChartX();
            DA.SetDataList(0, NLine.GetRhinoLinesFromNLines(dVis.VisForBarChartX()));
        }
    }
    if (circular)
    {
        dVis.InitForCircularChart();
        dVis.scale = s;
        if (flip)
        {
            DA.SetDataList(0, NLine.GetRhinoLinesFromNLines(dVis.GetLineByRemapDataToPolarFlip()));
            DA.SetDataList(1, dVis.GetCircleFromMinMax());
        }
        else
        {
            DA.SetDataList(0, NLine.GetRhinoLinesFromNLines(dVis.GetLineByRemapDataToPolar()));
            DA.SetDataList(1, dVis.GetCircleFromMinMax());
        }
    }




  return {
      //Ln: GetLineByRemapDataToPolar(Data, Point, Scale),
      //Cir:GetCircleFromMinMax(Data, Point, Scale)
  };
}
module.exports = {
    run: run
};


function NDataVis( _data, _height, _width){
    public List<double> data = new List<double>();
    public NVector origin = NVector.Origin();
    public double height = 100.0;
    public double width = 100.0;
    public double resX = 0.0;
    public double resY = 0.0;
    public double scale = 1.0;
    public double intervalX = 0.0;
    public double intervalY = 0.0;
    public double[] domainX = new double[2];
    public double[] domainY = new double[2];
    public double[] domain = new double[2]; // for circular one
    this.data = _data;
    this.height = _height;
    this.width = _width;
}
////////////////////////////// bar chart
NDataVis.prototype.InitForBarChartX=function(){
    domainX[0] = 0;
    domainX[1] = this.data.Count;
    domainY = NDataVis.GetDomain(data);
}
NDataVis.prototype.VisForBarChartX=function(){
    List<NLine> nLine = new List<NLine>();
    this.intervalX = (this.width) / (double)this.domainX[1];
    this.domainY = NDataVis.GetDomain(this.data);
    for (int i = 0; i < this.domainX[1]; i++)
    {
        double x = this.origin.X + intervalX * i;
        double y = this.origin.Y;
        double offsetY = Remap(this.data[i], this.domainY[0], this.domainY[1], this.origin.Y, this.origin.Y + this.height);
        nLine.Add(new NLine(new NVector(x, y, 0), new NVector(x, offsetY, 0)));
    }
    return nLine;
}
NDataVis.prototype.InitForBarChartY(){
    domainY[0] = 0;
    domainY[1] = this.data.Count;
    domainX = NDataVis.GetDomain(data);
}
NDataVis.prototype.VisForBarChartY=function(){
    List<NLine> nLine = new List<NLine>();
    this.intervalY = (this.height) / (double)this.domainY[1];
    this.domainX = NDataVis.GetDomain(this.data);
    for (int i = 0, c = (int)this.domainY[1]; i < c; ++i){
        double x = this.origin.X;
        double y = (this.origin.Y - intervalY * i) + this.height;
        double offsetX = Remap(this.data[i], this.domainX[0], this.domainX[1], this.origin.X, this.origin.X + this.width);
        nLine.Add(new NLine(new NVector(x, y, 0), new NVector(offsetX, y, 0)));
    }
    return nLine;
}
NDataVis.prototype.GetLegendForBarChart = function(){
    NVector p1 = new NVector(this.origin.X, this.origin.Y, 0);
    NVector p2 = new NVector(this.origin.X + this.width, this.origin.Y, 0);
    NVector p3 = new NVector(this.origin.X, this.origin.Y + this.height, 0);
    return null;
}
////////////////////////////// end bar chart

////////////////////////////// bar chart
NDataVis.prototype.InitForCircularChart = function(){
    this.domain = NDataVis.GetDomain(this.data);
    this.origin = new NVector(this.origin.X + (this.width * 0.5), this.origin.Y + (this.height * 0.5), 0);
}
NDataVis.GetLineByRemapDataToCarte = function(List<double> data, Point3d p, double scale, double width, double height){ // static method // VisDataToCarteCoord
    List<Line> lns = new List<Line>();
    int xRes = data.Count; // num for div Radius
    double kInterval = ((3.14159 * 2) - 0.0) / (double)xRes;

    for (int j = 0; j < xRes; j++)
    {
        double angle = kInterval * j;
        double radius = scale * data[j];
        double y = radius * (Math.Sin(angle));
        double x = radius * (Math.Cos(angle));
        Point3d p2 = new Point3d(x + p.X, y + p.Y, 0 + p.Z);
        lns.Add(new Line(p, p2));
    }
    return lns;
}
NDataVis.prototype.GetLineByRemapDataToPolar = function(){
    List<NLine> nLine = new List<NLine>();
    this.resX = this.data.Count; // num for div Radius
    double kInterval = ((3.14159 * 2) - 0.0) / (double)this.resX;
    for (int j = 0; j < this.resX; j++){
        double angle = kInterval * j;
        double radius = this.scale * data[j];
        double y = radius * (Math.Sin(-angle));
        double x = radius * (Math.Cos(-angle));
        NVector p2 = new NVector(x + this.origin.X, y + this.origin.Y, 0 + this.origin.Z);
        nLine.Add(new NLine(new NVector(this.origin.X, this.origin.Y, this.origin.Z), new NVector(p2.X, p2.Y, p2.Z)));
    }
    return nLine;
}
NDataVis.prototype.GetLineByRemapDataToPolarFlip = function(){
    List<NLine> nLine = new List<NLine>();
    this.resX = this.data.Count; // num for div Radius
    double kInterval = ((3.14159 * 2) - 0.0) / (double)this.resX;
    for (int j = 0; j < this.resX; j++){
        double angle = kInterval * j;
        double radius = this.scale * data[j];
        double y = radius * (Math.Sin(angle));
        double x = radius * (Math.Cos(angle));
        NVector p2 = new NVector(x + this.origin.X, y + this.origin.Y, 0 + this.origin.Z);
        nLine.Add(new NLine(new NVector(this.origin.X, this.origin.Y, this.origin.Z), new NVector(p2.X, p2.Y, p2.Z)));
    }
    return nLine;
}
NDataVis.prototype.GetCircleFromMinMax = function(){
    List<Circle> cir = new List<Circle>();
    Rhino.Geometry.Point3d oPt = new Rhino.Geometry.Point3d(this.origin.X, this.origin.Y, this.origin.Z);

    cir.Add(new Rhino.Geometry.Circle(oPt, this.domain[0] * scale));
    cir.Add(new Rhino.Geometry.Circle(oPt, this.domain[1] * scale));
    return cir;
}
NDataVis.prototype.GetLegendForCircleVis = function(){
    NVector p = new NVector(this.origin.X + this.width * 0.5, this.origin.Y + this.height, 0);
    return null;
}


//////////////////////////////////////////////////////////////////// static method
NDataVis.GetDomain = function(doubleList){
    double[] domain = new double[2];
    domain[0] = doubleList[0];
    domain[1] = doubleList[0];
    for (int i = 0, c = doubleList.Count; i < c; ++i)
    {
        if (domain[0] > doubleList[i])
        {
            domain[0] = doubleList[i];
        }
        if (domain[1] < doubleList[i])
        {
            domain[1] = doubleList[i];
        }
    }
    return domain;
}
NDataVis.Remap = function(double CValue, double OldMin, double OldMax, double NewMin, double NewMax){
    return (((CValue - OldMin) * (NewMax - NewMin)) / (OldMax - OldMin)) + NewMin;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////// end NDataVis class


///////////////////////////////////////////////////////////////////////////////////////////////////////// extra utility
function NLine( _v1, _v2){
    public NVector ptStart;
    public NVector ptEnd;
    this.ptStart = _v1;
    this.ptEnd = _v2;
}
NLine.prototype.ToFlux = function()
{
    return new Rhino.Geometry.Line(new Point3d(ptStart.X, ptStart.Y, ptStart.Z), new Point3d(ptEnd.X, ptEnd.Y, ptEnd.Z));
}
NLine.GetFluxLinesFromNLines = function(lns)
        {
            List<Line> temp = new List<Line>();
            for (int i = 0, c = lns.Count; i < c; ++i)
            {
                temp.Add( NLine.ToRhino(lns[i]));
            }
            return temp;
        }
NLine.ToRhino = function(nLn){
    return new Rhino.Geometry.Line(new Point3d(nLn.ptStart.X, nLn.ptStart.Y, nLn.ptStart.Z), new Point3d(nLn.ptEnd.X, nLn.ptEnd.Y, nLn.ptEnd.Z));
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
