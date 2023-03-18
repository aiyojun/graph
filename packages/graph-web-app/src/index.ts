import {Graph, CyberPanel, inject} from 'graph-engine'
import {DescriptionCard} from "./vision/cards";
import './fonts/roboto.css'
import {GridCard} from "./vision/grid-system";
import {VisionApp} from "./vision";

const graph = new Graph()
    .mount(document.getElementById('root'))
    .useTheme('classic')

new VisionApp(graph)





// const node1 = graph.createNode({
//     x: 0, y: 0,
//     w: 200, h: 120,
//     title: 'Node1',
//     inPortNumber: 2,
//     outPortNumber: 3
// })

// const node2 = graph.createNode({
//     x: 300, y: 200,
//     w: 200, h: undefined,
//     title: 'Node3',
//     // inPortNumber: 2,
//     // outPortNumber: 3
// }, [
//     {type: 0, i: 0, x: 0, y: 30, uuid: ''},
// ])

// const card1 =
//     new DescriptionCard('Algorithm', 'Convex', 'Do convex calculation with a matrix.')
//         .mount(node1.el)

// const card2 =
//     new DescriptionCard('Matrix Balance', 'Histogram', 'Make data more flat.')
//         .mount(node2.el)

// const card2 =
//     new CyberPanel().mount(node2.el, {
//         type: 'VLinearLayout',
//         children: [
//             {type: 'label', label: 'Control Panel'},
//             {type: 'input', label: '次表面半径', value: '10', specific: { placeholder: '次表面半径' }},
//             {type: 'number', label: '金属度', value: 12, specific: { placeholder: '金属度' }},
//             {type: 'input', label: 'IOR', value: '43', specific: { placeholder: 'IOR' }},
//             {
//                 type: 'HLinearLayout', children: [
//                     {
//                         type: 'button', label: 'Simulate', specific: {
//                             click: () => {
//                                 const snapshot = graph.snapshot()
//                                 console.info(JSON.stringify(snapshot))
//                                 graph
//                                     .changeWireStyle('dynamic')
//                             }
//                         }
//                     },
//                     {
//                         type: 'button', label: 'Stop', specific: {
//                             click: () => {
//                                 const snapshot = graph.snapshot()
//                                 console.info(JSON.stringify(snapshot))
//                                 graph
//                                     .changeWireStyle('static')
//                             }
//                         }
//                     },
//                 ]
//             }
//         ]
//     })
    // new GridCard()
    //     .mount(node2.el)

// const panelRoot = inject(
//     document.body,
//     `<div style="box-shadow: 0 0 10px 5px rgba(0,0,0,0.25); position: fixed; top: 0; bottom: 0; right: 0; width: 240px; background: #333;"></div>`
// )
// const panel = inject(panelRoot, `<div id="panel"></div>`) as HTMLElement
//
// new CyberPanel().mount(panel, {
//     type: 'VLinearLayout',
//     children: [
//         {type: 'label', label: 'Control Panel'},
//         {type: 'input', label: '次表面半径', value: '10', specific: { placeholder: '次表面半径' }},
//         {type: 'number', label: '金属度', value: 12, specific: { placeholder: '金属度' }},
//         {type: 'input', label: 'IOR', value: '43', specific: { placeholder: 'IOR' }},
//         {
//             type: 'HLinearLayout', children: [
//                 {
//                     type: 'button', label: 'Simulate', specific: {
//                         click: () => {
//                             const snapshot = graph.snapshot()
//                             console.info(JSON.stringify(snapshot))
//                             graph
//                                 .changeWireStyle('dynamic')
//                         }
//                     }
//                 },
//                 {
//                     type: 'button', label: 'Stop', specific: {
//                         click: () => {
//                             const snapshot = graph.snapshot()
//                             console.info(JSON.stringify(snapshot))
//                             graph
//                                 .changeWireStyle('static')
//                         }
//                     }
//                 },
//             ]
//         }
//     ]
// })