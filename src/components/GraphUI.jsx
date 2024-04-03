import React from "react";
import "./init"
import Graph from "react-vis-network-graph";


export default function GraphUI( { graph } ) {
    
    const options = {
      autoResize: false,

      layout: {
        hierarchical: false
      },
      edges: {
        color: "red"
      },
      height: "500px"
    };
  
    const events = {
      select: function (event) {
        var { nodes, edges } = event;
        console.log(edges);
        console.log(nodes);
      }
    };
    return (

        <Graph
            graph={graph}
            options={options}
            events={events}
            getNetwork={(network) => {
            //  if you want access to vis.js network api you can set the state in a parent component using this property
            }}
        />
    );
  }