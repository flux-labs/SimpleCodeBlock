### Flux: Code Block
> Simple Code Blocks from the Parkerator Phase 1 and 2


### Domain.js
- parameters: min(number), max(number)
- returns: Domain(list of number)

### GetClosestIndexFromPTS.js
- parameters: min(number), max(number)
- returns: index(number), point

### GetDuplication.js
![Alt text](/img/GetDuplication.png?raw=true "GetMeshByFourPoints")
- parameters: obj(json)
- returns: obj(json)

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

### GetMeshRotation.js	
![Alt text](/img/GetMeshRotation.png?raw=true "GetMeshExtrusionToPoint")
- parameters: mesh(mesh), angle(number), local(bool)
- returns: mesh


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
Reference: [line-intersect](https://github.com/psalaets/line-intersect)
- parameters: line1, line2
- returns: point

### IsInsideOfPolyline.js
![Alt text](/img/IsInsideOfPolyline_01.png?raw=true "false")
![Alt text](/img/IsInsideOfPolyline_02.png?raw=true "true")
Reference: [point-in-polygon](https://github.com/substack/point-in-polygon)
- parameters: Polyline(ListOfPoints), Point
- returns: Boolean

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

It automatically finds an optimized point gird with tolerance by the number.
![Alt text](/img/Polyline_GridOptimizer_01.png?raw=true "NPolyline")
The number of point in the grid is 50, and it takes 6 iteractions to meet the number within the tolerance.
![Alt text](/img/Polyline_GridOptimizer_02.png?raw=true "NPolyline")
The number of point in the grid is 106, and it takes 4 iteractions to meet the number within the tolerance.

### GridOptimizerWithinPolyline.js
![Alt text](/img/GridOptimizerWithinPolyline.png?raw=true "Grid Optimizer Within Polyline")
- parameters: boundary(Polyline), angle(number), xSpan(number), ySpan(number), xOff(number), yOff(number), remap(bool)
- returns: Pts(PointList), boundary(Polyline), NumPts(number)

### ExtractOuterVertices.js
![Alt text](/img/ExtractOuterVertices.png?raw=true "Grid Optimizer Within Polyline")
- parameters: In (Mesh)
- returns: Out (PointList)

### ReOrderLine.js
![Alt text](/img/ReOrderLines.png?raw=true "ReOrderLine")
- parameters: line(unordered line list)
- returns: line(ordered line list)

### SunVector.js
Reference: ASHRAE Handbook of Fundamentals
- parameters: Latitude(number), Day(number), Hour(number), South(number)
- returns: SolarPath(line), SolarVector(point), SolarLog(string)

>Data Visualization

### VisDataToPolarCoord.js
![Alt text](/img/VisDataToPolarCoord.png?raw=true "false")
- parameters:
- returns:

### DataVisChart.js
- parameters: data(listOfNumber), scale(number), width(number), height(number), circular(bool), flip(bool)
- returns: barChart(listOfLine) or CircularBarChart(listOfLine)
![Alt text](/img/VisDataBarChart.png?raw=true "bar chart")
![Alt text](/img/VisDataCircularBarChart.png?raw=true "circular bar chart")
![Alt text](/img/VisDataExample.png?raw=true "data vis example")

