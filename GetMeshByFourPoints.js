'use strict';
var modeling = require('flux-modelingjs').initialize().modeling;
function run(Vertices) {
    return {
        Mesh:GetMeshByFourPoints(Vertices)
    };
}
module.exports = {
    run: run
};
function GetMeshByFourPoints(Vertices) {
    var mesh = [];
    var Faces = [[0,1,2],[0,2,3]];
    var mesh = modeling.entities.mesh();
    for(var i = 0; i < Vertices.length; ++i) {
        mesh.vertex(Vertices[i]);
    }
    for(var j = 0; j < Faces.length; ++j) {
        mesh.face(Faces[j][0], Faces[j][1], Faces[j][2]);
    }
    return mesh;    
};