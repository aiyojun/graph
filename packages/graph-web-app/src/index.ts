import { Graph } from 'graph-engine'

const graph = new Graph()
	.mount(document.getElementById('root'))
	.useContext({ style: 'default', title: false })
	.useTheme('classic')

const node1 = graph.createNode({
	x: 80, y: 180,
	w: 120, h: 60,
	title: 'Node1',
	inPortNumber: 2,
	outPortNumber: 3
})

const node2 = graph.createNode({
	x: 100, y: 200,
	w: 120, h: 60,
	title: 'Node3',
	inPortNumber: 2,
	outPortNumber: 3
})