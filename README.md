### Flux: Code Block

> Simple Code Blocks from the Parkerator Phase 1 and 2


### Domain.js
Get
- parameters: min(number), max(number)
- returns: Domain(list of number)

Usage


### GetClosestIndexFromPTS.js

parameters: min(number), max(number)
returns: Domain(list of number)

### GetMeshByFourPoints.js	

parameters: min(number), max(number)
returns: Domain(list of number)


### GetMeshExtrusionByFourPoints.js	
parameters: min(number), max(number)
returns: Domain(list of number)


### GetMeshFromExtrudedPoint.js	
![Alt text](/img/GetMeshExtrusionToPoint.png?raw=true "GetMeshExtrusionToPoint")
parameters: points(ListOfPoint), height(number)
returns: mesh, centerPoint


### GetPolylineFromPts.js
parameters: min(number), max(number)
returns: Domain(list of number)


### Grid2D.js
parameters: min(number), max(number)
returns: Domain(list of number)


### Grid2DRndom.js	
parameters: min(number), max(number)
returns: Domain(list of number)


### Grid3D.js	
parameters: min(number), max(number)
returns: Domain(list of number)


### Grid3DRndom.js	
parameters: min(number), max(number)
returns: Domain(list of number)

### SunVector.js
parameters: Latitude(number), Day(number), Hour(number), South(number)
returns: SolarPath(line), SolarVector(point), SolarLog(string)


### NPolyline
![Alt text](/img/Polyline.png?raw=true "NPolyline")
- parameters: Point(ListOfPoint), closed(bool)
- returns: polyline(ListOfLine), Mesh, Length(number), Area(number)

instance methods
.Add(Point) : Add point to polyline
.Closed() : make it a closed polyline
.Open() : make it a open polyline
.GetClosedPtFromPt(Point) : retrun the closest point to a reference point
.GetCenterPt() : return the center point of the polyline
.ComputeArea() : return the area of polyline
.ComputeLength() : return the length of polyline
.ToPoint() : convert to list of point
.ToLine() : convert to list of line
.ToMesh() : convert to mesh

static methods
.BuildWithPoint(PointList) : create NPolyline from Point list
.BuildWithLine(LineList) : create NPolyline from line list


### IntersectionFromTwoLine.js
(https://github.com/psalaets/line-intersect)
parameters: line1, line2
returns: point


### RemapData
parameters: min(number), max(number)
returns: Domain(list of number)


