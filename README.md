### Flux: Code Block
> Simple Code Blocks from the Parkerator Phase 1 and 2

### Domain.js
- parameters: min(number), max(number)
- returns: Domain(list of number)

### GetClosestIndexFromPTS.js
- parameters: min(number), max(number)
- returns: index(number), point

### GetMeshByFourPoints.js	
![Alt text](/img/GetMeshByFourPoints.png?raw=true "GetMeshByFourPoints")
- parameters: min(number), max(number)
- returns: Domain(list of number)

### GetMeshExtrusionByFourPoints.js	
![Alt text](/img/GetMeshExtrusionByFourPoints.png?raw=true "GetMeshExtrusionByFourPoints")
- parameters: points(ListOfPoint), height(number)
- returns: mesh

### GetMeshFromExtrudedPoint.js	
![Alt text](/img/GetMeshExtrusionToPoint.png?raw=true "GetMeshExtrusionToPoint")
- parameters: points(ListOfPoint), height(number)
- returns: mesh, centerPoint

### GetPolylineFromPts.js
- parameters: min(number), max(number)
- returns: Domain(list of number)

### Grid2D.js
![Alt text](/img/Grid2D.png?raw=true "Grid2D")
- parameters: min(number), max(number)
- returns: Domain(list of number)

### Grid2DRndom.js
![Alt text](/img/Grid2DRndom.png?raw=true "Grid2DRndom")
- parameters: min(number), max(number)
- returns: Domain(list of number)

### Grid3D.js
![Alt text](/img/Grid3D.png?raw=true "Grid3D")
- parameters: min(number), max(number)
- returns: Domain(list of number)

### Grid3DRndom.js
![Alt text](/img/Grid3DRndom.png?raw=true "Grid3DRndom")
- parameters: min(number), max(number)
- returns: Domain(list of number)

### IntersectionFromTwoLine.js
![Alt text](/img/IntersectionFromTwoLine.png?raw=true "IntersectionFromTwoLine")
[line-intersect Reference](https://github.com/psalaets/line-intersect)

- parameters: line1, line2
- returns: point

### NPolyline
![Alt text](/img/Polyline.png?raw=true "NPolyline")
- parameters: Point(ListOfPoint), closed(bool)
- returns: polyline(ListOfLine), Mesh, Length(number), Area(number)

instance methods
* .Add(Point) : Add point to polyline
* .Closed() : make it a closed polyline
* .Open() : make it a open polyline
* .GetClosedPtFromPt(Point) : retrun the closest point to a reference point
* .GetCenterPt() : return the center point of the polyline
* .ComputeArea() : return the area of polyline
* .ComputeLength() : return the length of polyline
* .ToPoint() : convert to list of point
* .ToLine() : convert to list of line
* .ToMesh() : convert to mesh

static methods
* .BuildWithPoint(PointList) : create NPolyline from Point list
* .BuildWithLine(LineList) : create NPolyline from line list


### SunVector.js
- parameters: Latitude(number), Day(number), Hour(number), South(number)
- returns: SolarPath(line), SolarVector(point), SolarLog(string)


### RemapData
- parameters: min(number), max(number)
- returns: Domain(list of number)


