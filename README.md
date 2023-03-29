# Graph

中文README: https://github.com/aiyojun/graph/blob/master/README_ZH.md

> Graph is a GUI tool that describes a model of things using nodes and lines.
> Node data visualization, modular editing, data import and export and other functions.
> Written in Typescript and rendered by the native DOM api, with no front-end framework intrusion and maximum performance.
> The subproject graph-engine is the core rendering engine of Graph and can be imported as node_module.
> Provide concise api invoking.
> Can be Integrated with any front-end framework (**react/vue**).
> Support electron localization deployment.

electron version(machine vision algorithm application, my another opensource project)：

![image](https://github.com/aiyojun/graph/blob/master/electron-app.png)

## Application

Any problem that can be described using nodes and wires can be described using Graph for data visualization, model manipulation, JSON generation, and more.
Graph does not constrain your imagination and creativity, it can bring your wild ideas to life.

The functions that can be completed include but are not limited to the following:

1. Visualize topology data
2. Construction flow chart
3. Flow model simulation
4. ...

## Features

Currently, the project provides the following features:

### Function points related to Graph (basic function)
| No  | Function description               | Degree of completion | Time point |
|-----|------------------------------------|----------------------|------------|
| 1   | Graph Node creation                | ✔                    | 2023-03-11 |
| 2   | Operate Node                       | ✔                    | 2023-03-11 |
| 3   | Drag Node                          | ✔                    | 2023-03-11 |
| 4   | Graph zoom                         | ✔                    | 2023-03-11 |
| 5   | Connect nodes                      | ✔                    | 2023-03-11 |
| 6   | Wire delete                        |                      | -          |
| 7   | Frame selection                    | 50%                  | 2023-03-11 |
| 8   | Graph layer management             | 50%                  | 2023-03-11 |
| 9   | Edit operation record and withdraw |                      | -          |
| 10  | Full snapshot functionality        |                      |            |
| 11  | Node Incremental Dragging          |                      | -          |
| 12  | Adsorption alignment               |                      | -          |
| 13  | Automatic node arrangement         |                      | -          |
| 14  | Mass node folding with one key     |                      | -          |
| 15  | Grid background                    |                      | -          |
| 16  | Bright and dark theme              | ✔                    | 2023-03-12 |
| 17  | Dynamic Theme switching            | ✔                    | 2023-03-12 |

### Function points associated with Node
| No  | Function description                          | Degree of completion | Time point |
|-----|-----------------------------------------------|----------------------|------------|
| 1   | Node folding                                  |                      | -          |
| 2   | Move node to the top                          | ✔                    | 2023-03-11 |
| 4   | Compose nodes to Group                        | ✔                    | 2023-03-12 |
| 5   | Group decomposing                             | ✔                    | 2023-03-12 |
| 6   | Group folding                                 |                      | -          |
| 7   | Group background                              |                      | -          |
| 8   | Move nodes by group                           | ✔                    | 2023-03-12 |
| 9   | Generate different Node layer by requirements | ✔                    | 2023-03-13 |
| 10  | Events management optimization on node layer  |                      |            |

### Function points associated with Wire
| No  | Function description                                                      | Degree of completion | Time point |
|-----|---------------------------------------------------------------------------|----------------------|------------|
| 1   | Port generation by config                                                 | ✔                    | 2023-03-11 |
| 2   | ~~dynamic ports binding~~                                                 | ✔                    | 2023-03-13 |
| 3   | Different kinds of wire(optimized bessel，bessel curve，square broken line) | ✔                    | 2023-03-11 |
| 4   | Dynamic connection wire                                                   | ✔                    | 2023-03-11 |
| 5   | Port and connection validation                                            | ✔                    | 2023-03-11 |
| 6   | Wire color switching                                                      | ✔                    | 2023-03-11 |
| 7   | Text attach to wire                                                       |                      | -          |
| 8   | Wire with arrow                                                           | ✔                    | 2023-03-15 |
| 9   | Arrow style switching                                                     |                      | -          |

### Other functions
| No  | Function description                                           | Degree of completion | Time point |
|-----|----------------------------------------------------------------|----------------------|------------|
| 1   | Cross-end (browser) copy                                       |                      | -          |
| 2   | Supports multiple browsers, has been tested in Chrome, Firefox | ✔                    | 2023-03-11 |
| 3   | Model runtime state simulation                                 | ✔                    | 2023-03-11 |
| 4   | Customize partial shortcuts                                    | 10%                  | 2023-03-11 |
| 5   | Node graph data import and export                              | ✔                    | 2023-03-11 |
| 6   | Status bar prompt                                              | 5%                   | 2023-03-11 |
| 7   | Toggle background                                              |                      | -          |
| 8   | Added support for electron (rewrite electron section)          | ✔                    | 2023-03-11 |
| 9   | electron Cross-domain http request                             |                      |            |
| 10  | Publish module library                                         | ✔                    | 2023-03-16 |
| 11  | Manage with parent-child projects                              | ✔                    | 2023-03-16 |
| 12  | Provide ui panels for manipulation                             | ✔                    | 2023-03-17 |
| 13  | Switch between Chinese and English                             | ✔                    | 2023-03-19 |
| 14  | Thumbnail (generate sketch)                                    |                      | -          |
| 15  | Graphic export picture                                         |                      | -          |

Node exists only as a drag-and-drop container, and you can put any element, no matter how complex, into the created Node.

## Advantages and characteristics

- You can leave drag-and-drop nodes, module wiring, etc. to graph-engine and focus on the data logic itself.
- Very smooth operation experience; Concise api invoking; Seamless integration of any model; Super extensibility...
- Achieve browser native performance without any framework intrusion. There is no limit to the number of loaded nodes, and the performance depends entirely on the performance of your browser and the computer you are using.
- Up to the browser console performance monitor, no script invoking time cost unless necessary.
- Can be integrated with any framework! You can create a node for a Vue component, a node for a React component, or even your own framework with a simple call to the mount interface.
- If you choose Graph, then don't consider using any flow-chart-graph related projects (not necessarily, I'm shallow)! The performance and architecture beat all flow engines...

If you want to know more about other flow projects, do some research and comparison, etc., similar projects are:

1. react-flow(react)
2. vue-flow(vue)
3. flowy-vue
4. flowy
5. WireFlow
6. react-flow-chart
7. uber/react-digraph
