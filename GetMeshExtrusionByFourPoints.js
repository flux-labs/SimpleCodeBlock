'use strict';
var modeling = require('flux-modelingjs').initialize().modeling;
function run(Vertices, Height) {
    return {
        Mesh:GetMeshExtrusionByFourPoints(Vertices, Height)
    };
}
module.exports = {
    run: run
};
function GetMeshExtrusionByFourPoints(Vertices, Height) {
    var Faces = [[0,2,3],[0,3,1] , [2,4,5],[2,5,3], [4,6,7],[4,7,5] , [6,0,1],[6,1,7], [0,2,4],[0,4,6] , [1,3,5],[1,5,7]];
    var mesh = modeling.entities.mesh();
    var VerticesOther = []
    for(var i = 0; i < Vertices.length; ++i) {
        mesh.vertex(Vertices[i]);
        var upVertex = [Vertices[i][0], Vertices[i][1], Vertices[i][2] + Height]; 
        mesh.vertex(upVertex);
    }
    for(var j = 0; j < Faces.length; ++j) {
        mesh.face(Faces[j][0], Faces[j][1], Faces[j][2]);
    }
    var test = [];
    test.push(mesh);
    return mesh;    
};