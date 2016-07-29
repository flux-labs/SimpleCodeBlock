'use strict';
var _ = require('lodash');

function run(In) {
    var edges = [];
    for (let face of In.faces) {
        [[0,1],[1,2],[2,0]].forEach( indexes => {
            let edge = _.at(face, indexes);
            let reverseEdge = [edge[1],edge[0]];
            let index = _.findIndex(edges, reverseEdge);
            if (index >= 0)
                edges.splice(index, 1);
            else
                edges.push(edge);
        });
    }
    let face = edges.pop();
    let tail = face[1];
    while (edges.length > 1) {
        let index = _.findIndex(edges, edge => tail===edge[0] );
        tail = edges[index][1];
        face.push(tail);
        edges.splice(index, 1);
    }
    console.log(face);
    return { Out: _.at(In.vertices, face) };
}

module.exports = {
    run: run
};