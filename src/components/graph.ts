import { v4 } from 'uuid'
import { Point } from "../jlib/ds";
import { scale2d } from "../jlib/matrix"
import { wirePath } from "../jlib/svg"
import './essential.css'

export const uuidv4 = () => v4().replaceAll('-', '')
export type Context = { scale: number; useHandle: boolean; useTitle: boolean; }
export type BasicPort = { uuid?: string; type: number; i: number; x?: number; y?: number; }
export type Group = { uuid: string; x: number; y: number; w:number; h: number; follower: Array<string>; }
export type BasicWire = { from: BasicPort; to: BasicPort; }
export type Task = { type: number; cursor: Point; }
export type GraphJson = { nodes: Array<BasicNode>, wires: Array<BasicWire>; }
const setStyleBox = (el: HTMLElement, x: number, y: number, w: number, h: number) =>
{ el.style.top = `${y}px`; el.style.left = `${x}px`; el.style.width = `${w}px`; el.style.height = `${h}px`; }

export class Wrapper<T> {
    state: T
    el: HTMLElement
    sign: (_: T) => string
    constructor(target: T) { this.state = target }
    ref = () => document.getElementById(this.sign(this.state))
    refBy(sign: (_: T) => string) { this.sign = sign; return this }
    put(el: HTMLElement) { this.el = el; return this }
    static createBy<T>(target: T, sign: (_: T) => string): Wrapper<T>
    { const w = new Wrapper(target); w.refBy(sign); return w }
    static bind<T>(target: T, el: HTMLElement): Wrapper<T>
    { const w = new Wrapper(target); w.put(el); return w }
}

export type Node = Wrapper<BasicNode>
export type Wire = Wrapper<BasicWire>
export type Port = Wrapper<BasicPort>

export class BasicNode {
    uuid: string
    title?: string = ''
    x: number; y: number
    w?: number; h?: number
    ports?: Array<BasicPort>
    group?: string
}

function reactive<T extends { x: number, y: number, w?: number, h?: number }>(graph: Graph, node: T, el: HTMLElement): T {
    return new Proxy(node, {
        get(target: T, p: string | symbol, receiver: any): any { return target[p] },
        set(target: T, p: string | symbol, newValue: any, receiver: any): boolean {
            target[p] = newValue
            switch (p) {
                case 'x': el.style.left   = `${target[p]}px`; break;
                case 'y': el.style.top    = `${target[p]}px`; break;
                case 'w': el.style.width  = `${target[p] * graph.context.scale}px`; break;
                case 'h': el.style.height = `${target[p] * graph.context.scale}px`; break;
            }
            return true
        }})
}

export class Graph {
    root: HTMLElement
    palette: SVGElement
    iWire: SVGPathElement = null
    frame: HTMLDivElement = null
    task: Task = { type: -1, cursor: { x: 0, y: 0 } }
    nodes: Map<string, Wrapper<BasicNode>> = new Map()
    ports: Map<string, BasicPort> = new Map()
    wports: Map<string, Wrapper<BasicPort>> = new Map()
    wires: Array<Wrapper<BasicWire>> = []
    groups: Map<string, Wrapper<Group>> = new Map()
    linkageValidations: Array<(_1: BasicPort, _2: BasicPort) => boolean> = []
    snapshotOfNodes: Map<string, BasicNode> = new Map()
    snapshotOfGroups: Map<string, Group> = new Map()
    context: Context = { scale: 1.0, useHandle: false, useTitle: true, }
    begin: BasicPort
    animation: HTMLStyleElement = null
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
        document.head.insertAdjacentHTML('beforeend', `<style></style>`)
        this.animation = document.head.lastElementChild as HTMLStyleElement
        this.root.addEventListener('mousemove', e => this.handleMouseMove(e))
        this.root.addEventListener('mousedown', e => this.handleMouseDownOnGraph(e))
        this.root.addEventListener('wheel', e => this.handleWheel(e), { passive: false })
        window.addEventListener('mouseup', e => this.handleMouseUp(e))
        this.updateAnimation()
        return this
    }
    theme: string = 'bright'
    getTheme = () => this.theme
    useTheme(name: string) {
        if (this.theme === name) return this
        if (name === 'dark') {
            this.removeTheme()
            const link = document.createElement('link')
            link.href  = 'theme-dark.css'
            link.type  = 'text/css'
            link.rel   = 'stylesheet'
            document.head.appendChild(link)
            this.theme = name
        } else {
            this.removeTheme()
            this.theme = 'bright'
        }
        return this
    }
    removeTheme() {
        const es: Array<HTMLElement> = []
        for (let i = 0; i < document.head.children.length; i++) {
            const child = document.head.children[i]
            if (child instanceof HTMLLinkElement
                && (child as HTMLLinkElement).href
                    .match(/theme-[a-zA-Z0-9_-]+\.css$/) !== null)
            { es.push(child) }
        }
        es.forEach(e => e.remove())
    }
    // readonly() {}
    // snapshot() {}
    // inject() {}
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
    addWireValidation(fn: (_1: BasicPort, _2: BasicPort) => boolean) { this.linkageValidations.push(fn); return this }
    avoidSamePort() { return this.addWireValidation((from: BasicPort, to: BasicPort) => from.uuid === to.uuid && from.type === to.type && from.i === to.i) }
    avoidSameNode() { return this.addWireValidation((from: BasicPort, to: BasicPort) => from.uuid === to.uuid) }
    avoidSameType() { return this.addWireValidation((from: BasicPort, to: BasicPort) => from.type === to.type) }
    createNode(x = 0, y = 0, w = -1, h = -1, uuid: string = uuidv4(), ports: Array<BasicPort> = []): Wrapper<BasicNode> {
        const node: BasicNode = { uuid, x, y, w, h }
        if (w !== -1 && h !== -1 && ports.length === 0) {
            ports.push({ uuid: node.uuid, x: 0, y: h * 0.5, i: 0, type: 0 })
            ports.push({ uuid: node.uuid, x: w, y: h * 0.5, i: 0, type: 1 })
        }
        ports.forEach(port => { port.uuid = node.uuid; this.ports.set(this.portSign(port), port) })
        this.root.insertAdjacentHTML('beforeend', this.reuseNodeLayer(this.context, node, ports))
        const el = this.root.lastElementChild as HTMLDivElement
        if (w !== -1 && h !== -1) { el.style.width = `${w}px`; el.style.height = `${h}px` }
        const ref = reactive<BasicNode>(this, node, el)
        if (this.context.useHandle)
            el.children[1].addEventListener('mousedown', (e: MouseEvent) => this.handleMouseDownOnNode(e, ref.uuid))
        else
            el.addEventListener('mousedown', (e: MouseEvent) => this.handleMouseDownOnNode(e, ref.uuid))
        ports.forEach(portd => {
            const portel = document.getElementById(this.portSign(portd))
            portel.addEventListener('mousedown', e => this.handleMouseDownOnPort(e, ref, portd))
            portel.addEventListener('mouseup', e => this.handleMouseUpOnPort(e, ref, portd))
        })
        const wrapper = Wrapper.createBy<BasicNode>(ref, (n: BasicNode) => `node@${n.uuid}`)
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
    connect(from: BasicPort, to: BasicPort) {
        for (let i = 0; i < this.linkageValidations.length; i++) {
            const fn = this.linkageValidations[i]
            if (fn(from, to)) {
                return
            }
        }
        const wire = Wrapper.createBy<BasicWire>({from, to}, (wire: BasicWire) => this.wireSign(wire))
        this.palette.insertAdjacentHTML('beforeend', this.$wire(this,
            this.convert(this, this.nodes.get(wire.state.from.uuid).state, wire.state.from),
            this.convert(this, this.nodes.get(wire.state.to.uuid).state, wire.state.to),
            this.wireSign(wire.state)))
        this.wires.push(wire)
    }
    compose(nodes: Array<BasicNode>, bias: number = 10): Wrapper<Group> {
        const xMin = Math.min(...(nodes.map(node => node.x)))
        const xMax = Math.max(...(nodes.map(node => (node.x + node.w * this.context.scale))))
        const yMin = Math.min(...(nodes.map(node => node.y)))
        const yMax = Math.max(...(nodes.map(node => node.y + node.h * this.context.scale)))
        const g: Group = { uuid: uuidv4(), x: xMin - bias, y: yMin - bias, w: xMax - xMin + bias * 2, h: yMax - yMin + bias * 2, follower: nodes.map(x => x.uuid) }
        nodes.forEach(node => node.group = g.uuid)
        this.root.insertAdjacentHTML('beforeend', this.$group(this, g))
        const el = this.root.lastElementChild as HTMLDivElement
        el.addEventListener('mousedown', e => this.handleMouseDownOnGroup(e, g.uuid))
        const wrapper = Wrapper.createBy(reactive<Group>(this, g, el), g => `group@${g.uuid}`)
        this.groups.set(g.uuid, wrapper)
        return wrapper
    }
    decompose(uuid: string) {
        const group = this.groups.get(uuid)
        if (group === null) return
        group.state.follower.forEach(_uuid => {
            this.nodes.get(_uuid).state.group = undefined
        })
        group.ref().remove()
        this.groups.delete(uuid)
    }
    handleMouseDownOnPort(e: MouseEvent, node: BasicNode, port: BasicPort) {
        if (e.buttons === 1) {
            e.preventDefault()
            e.stopPropagation()
            this.begin = port
            this.palette.insertAdjacentHTML('afterbegin', this.$wire(this, this.convert(this, node, port),
                { x: e.clientX - this.root.offsetLeft, y: e.clientY - this.root.offsetTop }, "iwire@" + uuidv4()))
            this.iWire = this.palette.firstElementChild as SVGPathElement
            this.task = { type: 2, cursor: { x: e.clientX, y: e.clientY } }
        }
    }
    handleMouseUpOnPort(e: MouseEvent, node: BasicNode, port: BasicPort) {
        this.connect(this.begin, port)
    }
    handleMouseDownOnNode(e: MouseEvent, uuid: string) {
        if (e.buttons === 1) {
            const node = this.nodes.get(uuid)
            if ((node.state.group || '') === '') {
                e.preventDefault()
                e.stopPropagation()
                this.task = { type: 1, cursor: {x: e.clientX, y: e.clientY} }
                this.snapshotOfNodes.clear()
                this.snapshotOfNodes.set(node.state.uuid, { ...node.state })
            } else {
                this.handleMouseDownOnGroup(e, node.state.group)
            }
        }
    }
    handleMouseDownOnGroup(e: MouseEvent, uuid: string) {
        if (e.buttons == 1) {
            e.preventDefault()
            e.stopPropagation()
            const ref = this.groups.get(uuid)
            this.task = { type: 5, cursor: { x: e.clientX, y: e.clientY } }
            this.snapshotOfGroups.clear()
            this.snapshotOfGroups.set(ref.state.uuid, {  ...ref.state })
            this.snapshotOfNodes.clear()
            ref.state.follower.forEach(uuid =>
                this.snapshotOfNodes.set(uuid, { ...this.nodes.get(uuid).state }))
        }
    }
    handleMouseDownOnGraph(e: MouseEvent) {
        if (e.buttons === 1) {
            e.preventDefault()
            this.setFrame()
            this.task = { type: 4, cursor: { x: e.clientX, y: e.clientY } }
        } else if (e.buttons === 4) {
            e.preventDefault()
            this.snapshotOfNodes.clear()
            this.nodes.forEach(node => this.snapshotOfNodes.set(node.state.uuid, { ...node.state }))
            this.snapshotOfGroups.clear()
            this.groups.forEach(group => this.snapshotOfGroups.set(group.state.uuid, { ...group.state }))
            this.task = { type: 3, cursor: { x: e.clientX, y: e.clientY } }
        }
    }
    handleMouseMove(e: MouseEvent) {
        if (e.buttons === 1 && this.task.type === 1) {
            const snapshot = Array.from(this.snapshotOfNodes.values())[0]
            const node = this.nodes.get(snapshot.uuid)
            node.state.x = snapshot.x + e.clientX - this.task.cursor.x
            node.state.y = snapshot.y + e.clientY - this.task.cursor.y
        } else if (e.buttons === 1 && this.task.type === 2) {
            this.iWire.setAttribute('d', this.pathd(
                this.context.scale, this.convert(this, this.nodes.get(this.begin.uuid).state, this.begin),
                { x: e.clientX - this.root.offsetLeft, y: e.clientY - this.root.offsetTop }))
        } else if (e.buttons === 1 && this.task.type === 4) {
            this.setFrame(e)
        } else if (e.buttons === 1 && this.task.type === 5) {
            this.moveGroup(e)
        } else if (e.buttons === 4 && this.task.type === 3) {
            this.nodes.forEach(node => {
                const snapshot = this.snapshotOfNodes.get(node.state.uuid)
                node.state.x = snapshot.x + e.clientX - this.task.cursor.x
                node.state.y = snapshot.y + e.clientY - this.task.cursor.y
            })
            this.groups.forEach(group => {
                const snapshot = this.snapshotOfGroups.get(group.state.uuid)
                group.state.x = snapshot.x + e.clientX - this.task.cursor.x
                group.state.y = snapshot.y + e.clientY - this.task.cursor.y
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
            this.groups.forEach(group => {
                const pos = transform(group.state.x, group.state.y)
                group.state.x = pos.x; group.state.y = pos.y
            })
        })
        this.updateWire()
        this.updateAnimation()
    }
    //
    pathd = (scale: number, from: Point, to: Point) => {
        const arg = {p1dir: 'right', p2dir: 'left', p2x: 200, p1y: 200, p1x: 600, p2y: 300, scale: scale, delta: 30, wire: 'curve', edge: 6};
        arg.p1x = from.x; arg.p1y = from.y; arg.p2x = to.x; arg.p2y = to.y; return wirePath(arg)}
    driveZoom(graph: Graph, scale: number) {
        graph.palette.setAttribute('stroke-width', String(1.6 * this.context.scale))
        graph.nodes .forEach(node  =>  node.ref().style.transform = `scale(${scale})`)
        graph.groups.forEach(group => group.ref().style.transform = `scale(${scale})`)
    }
    reuseNodeLayer(context: Context, node: BasicNode, ports: Array<BasicPort>) {
        return (`<div id="node@${node.uuid}" class="node" style="left: ${node.x}px; top: ${node.y}px; transform: scale(${context.scale});${context.useHandle ? '' : 'cursor: move;'}">
            <div class="custom-node-background"></div>
            ${context.useHandle ? '<div class="handle"></div>' : ''}
            ${context.useTitle  ? `<div class="title">${node.title}</div>` : ''}
            ${ports.map(port => (`<div 
                class="port" id="${this.portSign(port)}" 
                style="left: ${port.x - 5}px; top: ${port.y - 5}px; width: 10px; height: 10px;">
                <div class="custom-port-background"></div>
            </div>`)).join('')}
        </div>`)
    }
    $wire = (graph: Graph, from: Point, to: Point, id: string) => (`<path class="wire dynamic-dash" id="${id}" fill="none" d="${this.pathd(graph.context.scale, from, to)}"></path>`)
    $group = (graph: Graph, node: Group) => (`<div id="group@${node.uuid}" class="group" style="top: ${node.y}px; left: ${node.x}px; width: ${node.w}px; height: ${node.h}px; transform: scale(${graph.context.scale});"><div class="custom-group-background"></div></div>`)
    portSign = (port: BasicPort) => (`port@${port.type}@${port.i}@${port.uuid}`)
    wireSign = (wire: BasicWire) => (`wire@${wire.from.type}@${wire.from.i}@${wire.from.uuid}@${wire.to.type}@${wire.to.i}@${wire.to.uuid}`)
    convert  = (graph: Graph, node: BasicNode, port: BasicPort) => ({ x: node.x + port.x * graph.context.scale, y: node.y + port.y * graph.context.scale })
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
    moveGroup(e: MouseEvent) {
        const snapshot = Array.from(this.snapshotOfGroups.values())[0]
        const group = this.groups.get(snapshot.uuid).state
        const deltaX = e.clientX - this.task.cursor.x
        const deltaY = e.clientY - this.task.cursor.y
        group.x = snapshot.x + deltaX; group.y = snapshot.y + deltaY
        group.follower.forEach(uuid => {
            const snap = this.snapshotOfNodes.get(uuid)
            const node = this.nodes.get(uuid).state
            node.x = snap.x + deltaX; node.y = snap.y + deltaY
        })
    }
    updateAnimation() {
        const dashWidth = 5 * this.context.scale
        this.animation.innerText = `
        .dynamic-dash {
            animation: dash-stream 1s linear infinite;
            stroke-dasharray: ${dashWidth}, ${dashWidth};
        }
        @keyframes dash-stream {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: ${- dashWidth * 10}; }
        }
        `
    }
}