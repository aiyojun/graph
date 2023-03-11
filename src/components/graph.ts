import { v4 } from 'uuid'
import { Point } from "../jlib/ds";
import { scale2d } from "../jlib/matrix"
import { wirePath } from "../jlib/svg"
import './theme-dark.css'

export const uuidv4 = () => v4().replaceAll('-', '')
export type Context = { scale: number; }
export type Port = { uuid?: string; type: number; i: number; x?: number; y?: number; }
export type Node = { uuid: string; x: number; y: number; w?:number; h?: number; ports?: Array<Port>; }
export type Wire = { from: Port; to: Port; }
export type Task = { type: number; cursor: Point; }
export type GraphJson = { nodes: Array<Node>, wires: Array<Wire>; }
const setStyleBox = (el: HTMLElement, x: number, y: number, w: number, h: number) =>
{ el.style.top = `${y}px`; el.style.left = `${x}px`; el.style.width = `${w}px`; el.style.height = `${h}px`; }

export class Wrapper<T> {
    state: T
    sign: (_: T) => string
    constructor(target: T, sign: (_: T) => string) { this.state = target; this.sign = sign }
    ref = () => document.getElementById(this.sign(this.state))
}

export class Graph {
    root: HTMLElement
    palette: SVGElement
    iWire: SVGPathElement = null
    frame: HTMLDivElement = null
    task: Task = { type: -1, cursor: { x: 0, y: 0 } }
    nodes: Map<string, Wrapper<Node>> = new Map()
    ports: Map<string, Port> = new Map()
    wires: Array<Wrapper<Wire>> = []
    linkageValidations: Array<(_1: Port, _2: Port) => boolean> = []
    states: Map<string, Node> = new Map()
    context: Context = { scale: 1.0 }
    begin: Port
    mount(el: HTMLElement) {
        this.root = el
        this.root.className = 'graph overlay'
        this.root.insertAdjacentHTML('afterbegin', `<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="auto" class="overlay palette"></svg>`)
        this.palette = this.root.firstElementChild as SVGElement
        const self = this
        this.context = new Proxy(this.context, {
            get(target: Context, p: string | symbol, receiver: any): any { return target[p] },
            set(target: Context, p: string | symbol, newValue: any, receiver: any): boolean {
                target[p] = newValue
                switch (p) {
                    case 'scale': self.driveZoom(self, target[p]); break;
                }
                return true
            }})
        this.root.addEventListener('mousemove', e => this.handleMouseMove(e))
        this.root.addEventListener('mousedown', e => this.handleMouseDownOnGraph(e))
        this.root.addEventListener('wheel', e => this.handleWheel(e), { passive: false })
        window.addEventListener('mouseup', e => this.handleMouseUp(e))
        return this
    }
    readonly() {}
    snapshot() {}
    inject() {}
    useTheme(name: string) {}
    parse(data: GraphJson) {
        data.nodes.forEach(node => { this.createNode(node.x, node.y, 200, 80, node.uuid, node.ports) })
        data.wires.forEach(wire => { this.connect(wire.from, wire.to) })
        return this
    }
    dump(): GraphJson {
        const self = this
        const data = { nodes: [], wires: [] }
        this.nodes.forEach(wnode => {
            const node = wnode.state
            const ports = []
            self.ports.forEach(port => {
                if (port.uuid === node.uuid)
                    ports.push({ type: port.type, i: port.i, x: port.x, y: port.y })
            })
            data.nodes.push({ ...node, ports: ports })
        })
        this.wires.forEach(wrwire => {
            const wire = wrwire.state
            data.wires.push({
                from: { uuid: wire.from.uuid, type: wire.from.type, i: wire.from.i },
                to  : { uuid: wire.  to.uuid, type: wire.  to.type, i: wire.  to.i },
            })
        })
        return data
    }
    addWireValidation(fn: (_1: Port, _2: Port) => boolean) { this.linkageValidations.push(fn); return this }
    avoidSamePort() { return this.addWireValidation((from: Port, to: Port) => from.uuid === to.uuid && from.type === to.type && from.i === to.i) }
    avoidSameNode() { return this.addWireValidation((from: Port, to: Port) => from.uuid === to.uuid) }
    avoidSameType() { return this.addWireValidation((from: Port, to: Port) => from.type === to.type) }
    createNode(x = 0, y = 0, w = -1, h = -1, uuid: string = uuidv4(), ports: Array<Port> = []): Wrapper<Node> {
        const node = { uuid, x, y }
        if (w !== -1 && h !== -1 && ports.length === 0) {
            ports.push({ uuid: node.uuid, x: 0, y: h * 0.5, i: 0, type: 0 })
            ports.push({ uuid: node.uuid, x: w, y: h * 0.5, i: 0, type: 1 })
        }
        ports.forEach(port => { port.uuid = node.uuid; this.ports.set(this.portSign(port), port) })
        this.root.insertAdjacentHTML('beforeend', this.$node(this, node, ports))
        const el = this.root.lastElementChild as HTMLDivElement
        if (w !== -1 && h !== -1) { el.style.width = `${w}px`; el.style.height = `${h}px` }
        const ref = new Proxy(node, {
            get(target: Node, p: string | symbol, receiver: any): any { return target[p] },
            set(target: Node, p: string | symbol, newValue: any, receiver: any): boolean {
                target[p] = newValue
                switch (p) {
                    case 'x': el.style.left = `${target[p]}px`; break;
                    case 'y': el.style.top  = `${target[p]}px`; break;
                }
                return true
            }})
        el.addEventListener('mousedown', e => this.handleMouseDownOnNode(e, ref.uuid))
        ports.forEach(portd => {
            const portel = document.getElementById(this.portSign(portd))
            portel.addEventListener('mousedown', e => this.handleMouseDownOnPort(e, ref, portd))
            portel.addEventListener('mouseup', e => this.handleMouseUpOnPort(e, ref, portd))
        })
        const wrapper = new Wrapper<Node>(ref, (n: Node) => `node@${n.uuid}`)
        this.nodes.set(ref.uuid, wrapper)
        return wrapper
    }
    updateWire() {
        for (let i = 0; i < this.wires.length; i++) {
            const wire = this.wires[i]
            wire.ref().setAttribute('d', this.pathd(this.context.scale,
                this.convert(this, this.nodes.get(wire.state.from.uuid).state, wire.state.from),
                this.convert(this, this.nodes.get(wire.state.to.uuid).state, wire.state.to)))
        }
    }
    connect(from: Port, to: Port) {
        for (let i = 0; i < this.linkageValidations.length; i++) {
            const fn = this.linkageValidations[i]
            if (fn(from, to)) {
                // console.info(`validation un-pass ${i} ${fn.toString()}`)
                return
            }
        }
        const wire = new Wrapper<Wire>({from, to}, (wire: Wire) => this.wireSign(wire))
        this.palette.insertAdjacentHTML('beforeend', this.$wire(this,
            this.convert(this, this.nodes.get(wire.state.from.uuid).state, wire.state.from),
            this.convert(this, this.nodes.get(wire.state.to.uuid).state, wire.state.to),
            this.wireSign(wire.state)))
        this.wires.push(wire)
    }
    handleMouseDownOnPort(e: MouseEvent, node: Node, port: Port) {
        if (e.buttons === 1) {
            e.stopPropagation()
            this.begin = port
            this.palette.insertAdjacentHTML('afterbegin', this.$wire(this, this.convert(this, node, port),
                { x: e.clientX - this.root.offsetLeft, y: e.clientY - this.root.offsetTop }, "iwire@" + uuidv4()))
            this.iWire = this.palette.firstElementChild as SVGPathElement
            this.task = { type: 2, cursor: { x: e.clientX, y: e.clientY } }
        }
    }
    handleMouseUpOnPort(e: MouseEvent, node: Node, port: Port) {
        this.connect(this.begin, port)
    }
    handleMouseDownOnNode(e: MouseEvent, uuid: string) {
        e.stopPropagation()
        const ref = this.nodes.get(uuid)
        this.task = { type: 1, cursor: {x: e.clientX, y: e.clientY} }
        this.states.clear()
        this.states.set(ref.state.uuid, { ...ref.state })
    }
    handleMouseDownOnGraph(e: MouseEvent) {
        if (e.buttons === 1) {
            e.preventDefault()
            this.setFrame()
            this.task = { type: 4, cursor: { x: e.clientX, y: e.clientY } }
        } else if (e.buttons === 4) {
            e.preventDefault()
            this.states.clear()
            this.nodes.forEach(node => this.states.set(node.state.uuid, { ...node.state }))
            this.task = { type: 3, cursor: { x: e.clientX, y: e.clientY } }
        }
    }
    handleMouseMove(e: MouseEvent) {
        if (e.buttons === 1 && this.task.type === 1) {
            const state = Array.from(this.states.values())[0]
            const ref = this.nodes.get(state.uuid)
            ref.state.x = state.x + e.clientX - this.task.cursor.x
            ref.state.y = state.y + e.clientY - this.task.cursor.y
        } else if (e.buttons === 1 && this.task.type === 2) {
            this.iWire.setAttribute('d', this.pathd(
                this.context.scale, this.convert(this, this.nodes.get(this.begin.uuid).state, this.begin),
                { x: e.clientX - this.root.offsetLeft, y: e.clientY - this.root.offsetTop }))
        } else if (e.buttons === 1 && this.task.type === 4) {
            this.setFrame(e)
        } else if (e.buttons === 4 && this.task.type === 3) {
            this.nodes.forEach(node => {
                node.state.x = this.states.get(node.state.uuid).x + e.clientX - this.task.cursor.x
                node.state.y = this.states.get(node.state.uuid).y + e.clientY - this.task.cursor.y
            })
        }
        this.updateWire()
    }
    handleMouseUp(e: MouseEvent) {
        if (this.iWire !== null) {
            const iw = document.getElementById(this.iWire.id)
            if (iw !== null) {
                iw.remove();
                this.iWire = null
            }
        }
        if (this.frame !== null) {
            this.frame.remove()
            this.frame = null
        }
        this.task.type = -1
    }
    handleWheel(e: WheelEvent) {
        // if (!e.ctrlKey) return
        e.preventDefault()
        const pivot = { x: e.clientX - this.root.offsetLeft, y: e.clientY - this.root.offsetTop }
        scale2d(pivot, this.context.scale, -e.deltaY, (newScale, transform) => {
            this.context.scale = newScale
            this.nodes.forEach(node => {
                const pos = transform(node.state.x, node.state.y)
                node.state.x = pos.x; node.state.y = pos.y
            })
        })
        this.updateWire()
    }
    //
    pathd = (scale: number, from: Point, to: Point) => {
        const arg = {p1dir: 'right', p2dir: 'left', p2x: 200, p1y: 200, p1x: 600, p2y: 300, scale: scale, delta: 30, wire: 'curve', edge: 6};
        arg.p1x = from.x; arg.p1y = from.y; arg.p2x = to.x; arg.p2y = to.y; return wirePath(arg)}
    driveZoom(graph: Graph, scale: number) {
        graph.palette.setAttribute('stroke-width', String(1.6 * this.context.scale))
        graph.nodes.forEach(node => node.ref().style.transform = `scale(${scale})`)}
    $node = (graph: Graph, props: Node, ports: Array<Port>) => (`<div id="node@${props.uuid}" class="node" style="left: ${props.x}px; top: ${(props.y)}px; transform: scale(${graph.context.scale});">
        ${ports.map(port => (`<div class="port" id="${this.portSign(port)}" style="left: ${port.x - 5}px; top: ${port.y - 5}px; border-radius: 10px; width: 10px; height: 10px;"></div>`)).join('')}</div>`)
    $wire = (graph: Graph, from: Point, to: Point, id: string) => (`<path class="wire dynamic-dash" id="${id}" fill="none" d="${this.pathd(graph.context.scale, from, to)}"></path>`)
    portSign = (port: Port) => (`port@${port.type}@${port.i}@${port.uuid}`)
    wireSign = (wire: Wire) => (`wire@${wire.from.type}@${wire.from.i}@${wire.from.uuid}@${wire.to.type}@${wire.to.i}@${wire.to.uuid}`)
    convert  = (graph: Graph, node: Node, port: Port) => ({ x: node.x + port.x * graph.context.scale, y: node.y + port.y * graph.context.scale })
    setFrame = (e: MouseEvent = null) => {
        if (e === null) {
            if (this.frame === null) {
                this.root.insertAdjacentHTML('beforeend', `<div class="frame"></div>`)
                this.frame = this.root.lastElementChild as HTMLDivElement
            }
            setStyleBox(this.frame, this.task.cursor.x - this.root.offsetLeft, this.task.cursor.y - this.root.offsetTop, 0, 0)
            return
        }
        if (this.frame !== null) {
           const c1 = this.task.cursor.x - this.root.offsetLeft; const c2 = e.clientX - this.root.offsetLeft;
           const c3 = this.task.cursor.y - this.root.offsetTop ; const c4 = e.clientY - this.root.offsetTop;
           const begin = { x: Math.min(c1, c2), y: Math.min(c3, c4) }
           const end   = { x: Math.max(c1, c2), y: Math.max(c3, c4) }
            setStyleBox(this.frame, begin.x, begin.y, Math.abs(end.x - begin.x), Math.abs(end.y - begin.y))
        }
    }
}