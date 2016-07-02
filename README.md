Flux: Code Block

Simple Code Blocks from the Parkerator Phase 1 and 2


Domain.js
Get
parameters: min(number), max(number)
returns: Domain(list of number)

Usage


GetClosestIndexFromPTS.js

parameters: min(number), max(number)
returns: Domain(list of number)

GetMeshByFourPoints.js	

parameters: min(number), max(number)
returns: Domain(list of number)


GetMeshExtrusionByFourPoints.js	
parameters: min(number), max(number)
returns: Domain(list of number)


GetMeshFromExtrudedPoint.js	
parameters: min(number), max(number)
returns: Domain(list of number)


GetPolylineFromPts.js
parameters: min(number), max(number)
returns: Domain(list of number)


Grid2D.js
parameters: min(number), max(number)
returns: Domain(list of number)


Grid2DRndom.js	
parameters: min(number), max(number)
returns: Domain(list of number)


Grid3D.js	
parameters: min(number), max(number)
returns: Domain(list of number)


Grid3DRndom.js	
parameters: min(number), max(number)
returns: Domain(list of number)

SunVector.js
parameters: Latitude(number), Day(number), Hour(number), South(number)
returns: SolarPath(line), SolarVector(point), SolarLog(string)


NPolyline
parameters: min(number), max(number)
returns: Domain(list of number)

instance methods
.Add(Point) :
.Closed() :
.Open() :
.GetClosedPtFromPt(Point) :
.GetCenterPt() :
.ComputeArea() : 
.ComputeLength();
.ToPoint();
.ToLine();
.ToMesh();

static methods
.BuildWithPoint(PointList) :
.BuildWithLine(LineList) :


IntersectionFromTwoLine
(https://github.com/psalaets/line-intersect)
parameters: line1, line2
returns: point


RemapData
parameters: min(number), max(number)
returns: Domain(list of number)


