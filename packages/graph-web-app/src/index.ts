import { Graph } from 'graph-engine'

const graph = new Graph()
	.mount(document.getElementById('root'))
	.useTheme('custom')

const node1 = graph.createNode({x: 0, y: 0, w: 400, h: 160, title: 'Node1'})

const node2 = graph.createNode({x: 0, y: 200, w: 400, h: 160, title: 'Node2'})