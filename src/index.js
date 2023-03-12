import { Graph} from '@/components/graph'


// test

const graph = new Graph()
    .mount(document.getElementById('root'))
    .avoidSamePort()
    .avoidSameType()
    // .parse({"nodes":[{"uuid":"00fcb9d2cb0f4ce1af744e2cb2f81c82","x":100,"y":100,"ports":[{"type":0,"i":0,"x":0,"y":40},{"type":1,"i":0,"x":200,"y":40}]},{"uuid":"4e8a54f076494f60b97f555664d442d1","x":400,"y":100,"ports":[{"type":0,"i":0,"x":0,"y":40},{"type":1,"i":0,"x":200,"y":40}]}],"wires":[]})


const node1 = graph.createNode(100, 50, 200, 80)
const node2 = graph.createNode(350, 20, 200, 80)
const group = graph.compose([node1.state, node2.state])


// let node = null
// node = graph.createNode(100, 100,
//     200, 80
// )
// graph.createNode(400, 100,
//     200, 80
// )
// console.info(node.ref())
// const trigger = () => {
//
// console.info(JSON.stringify(graph.dump()))
// }
document.body.insertAdjacentHTML('beforeend', `<button style="position: absolute; top: 50px; right: 100px;">Create Node</button>`)
document.body.lastElementChild.addEventListener('click', () => graph.createNode(Math.random() * 1000, Math.random() * 800, 200, 80))

document.body.insertAdjacentHTML('beforeend', `<button style="position: absolute; top: 80px; right: 100px;">Dump</button>`)
document.body.lastElementChild.addEventListener('click', () => console.info(JSON.stringify(graph.dump())))

document.body.insertAdjacentHTML('beforeend', `<button style="position: absolute; top: 110px; right: 100px;">Decompose</button>`)
document.body.lastElementChild.addEventListener('click', () => graph.decompose(group.state.uuid))

document.body.insertAdjacentHTML('beforeend', `<button style="position: absolute; top: 140px; right: 100px;">Dark theme</button>`)
document.body.lastElementChild.addEventListener('click', () => graph.useTheme('dark'))

document.body.insertAdjacentHTML('beforeend', `<button style="position: absolute; top: 170px; right: 100px;">Bright theme</button>`)
document.body.lastElementChild.addEventListener('click', () => graph.useTheme('bright'))

// setTimeout(() => {
// }, 500)

// setTimeout(() => {
//     node.x = 500
//     node.y = 500
// }, 6000)