import { v4 } from 'uuid'
import {inject, injectFront, Point, scale2d, wirePath} from "./jlib";
import './essential.css'
import SvgAnchor from './assets/anchor.svg'
import {Menu, MenuItem} from "./menu";

export type BasicContext = {
    scale: number;
    keepSilence: boolean;
    style: 'default' | 'handle';
    lock: 'ctrl' | 'alt' | 'none';
    title: boolean;
    readonly: boolean;
    theme: string;
    selection: boolean;
    background: 'pure' | 'dot';
    wire: 'default' | 'dynamic';
    arrow: boolean;
}

export type OptionalContext ={[K in keyof BasicContext]?: BasicContext[K]}

export type BasicPort = {
    uuid?: string;
    type: number;
    i: number;
    x?: number;
    y?: number;
}

export type Group = {
    uuid: string;
    x: number;
    y: number;
    w: number;
    h: number;
    follower: Array<string>;
}

export type BasicWire = {
    from: BasicPort;
    to: BasicPort;
}

export type Task = {
    type: number;
    cursor: Point;
}

export type GraphJson = {
    nodes: Array<BasicNode>,
    wires: Array<BasicWire>;
}

export type Interceptor = {
    filter: Function;
    then: Function
}

export type Node = Wrapper<BasicNode>

export type Wire = Wrapper<BasicWire>

export type Port = Wrapper<BasicPort>

export const uuidv4 = () => v4().replaceAll('-', '')
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

function reactive<T extends Object>(target: T, interceptors: Array<Interceptor>) {
    return new Proxy(target, {
        get(target: T, p: string | symbol, receiver: any): any { return target[p] },
        set(target: T, p: string | symbol, nv: any, receiver: any): boolean {
            target[p] = nv
            for (let i = 0; i < interceptors.length; i++) {
                try {
                    if (interceptors[i].filter(p)) {
                        target[p] = nv
                        interceptors[i].then(target[p])
                        break
                    }
                } catch (e) {
                    console.error(e)
                }
            }
            return true
        }
    })
}

const buildGeometryInterceptors: (el: HTMLElement, context: BasicContext) => Array<Interceptor> = (el, context) => ([
    { filter: k => k ==='x', then: v => el.style.left   = `${v}px` },
    { filter: k => k ==='y', then: v => el.style.top    = `${v}px` },
    { filter: k => k ==='w', then: v => el.style.width  = `${v * context.scale}px` },
    { filter: k => k ==='h', then: v => el.style.height = `${v * context.scale}px` },
])

export class BasicNode {
    uuid: string
    title?: string = ''
    x: number; y: number
    w?: number; h?: number
    ports?: Array<BasicPort>
    group?: string
}

export class Graph {
    private root: HTMLElement
    private rootRect: DOMRect
    private palette: SVGElement
    private iWire: SVGPathElement = null
    private frame: HTMLDivElement = null
    private task: Task = { type: -1, cursor: { x: 0, y: 0 } }
    private nodes: Map<string, Wrapper<BasicNode>> = new Map()
    private ports: Map<string, Wrapper<BasicPort>> = new Map() // Whether it's necessary to manage external ports?
    private wires: Array<Wrapper<BasicWire>> = []
    private arrows: Array<SVGPathElement> = []
    private groups: Map<string, Wrapper<Group>> = new Map()
    private linkageValidations: Array<(_1: BasicPort, _2: BasicPort) => boolean> = []
    // TODO: add more snapshots management functions(from entire graph)
    private snapshotOfNodes: Map<string, BasicNode> = new Map()
    private snapshotOfGroups: Map<string, Group> = new Map()
    private context: BasicContext = {
        scale: 1.0,
        keepSilence: true,
        style: 'default',
        lock: 'none',
        title: false,
        readonly: false,
        theme: 'bright',
        selection: false,
        background: 'pure',
        wire: 'default',
        arrow: false,
    }
    private begin: BasicPort
    private animation: HTMLStyleElement = null
    private menu: Menu = null
    constructor(config: OptionalContext = {})
    { Array.from(Object.keys(config)).forEach(k => { if (k in this.context) this.context[k] = config[k] }) }
    useContext(config: OptionalContext = {}) {
        Array.from(Object.keys(config)).forEach(k => { if (k in this.context) this.context[k] = config[k] });
        if (!this.context.keepSilence) {
            console.info(this.context)
        }
        return this
    }
    mount(el: HTMLElement) {
        this.root = el
        this.root.innerHTML = ``
        this.root.className = 'graph overlay'
        this.rootRect = this.root.getBoundingClientRect()
        if (this.context.background === 'dot')
            injectFront(this.root, this.generateBackPanel())
        this.palette = inject(this.root, `<svg xmlns="http://www.w3.org/2000/svg" stroke-width="${1.6 * this.context.scale}" shape-rendering="auto" class="overlay palette"></svg>`) as SVGElement
        this.context = reactive(this.context,
            [{ filter: k => k === 'scale', then: v => this.driveZoom(this, v) }])
        this.animation = inject(document.head, `<style></style>`) as HTMLStyleElement
        this.root.addEventListener('mousemove', e => this.handleMouseMove(e))
        this.root.addEventListener('mousedown', e => this.handleMouseDownOnGraph(e))
        this.root.addEventListener('wheel', e => this.handleWheel(e), { passive: false })
        window.addEventListener('mouseup', e => this.handleMouseUp(e))
        document.oncontextmenu = () => false
        this.updateAnimation() // first invoking ...
        return this
    }
    setMenu(items: Array<MenuItem>) {
        this.menu = Menu.create(items)
    }
    clear() {
        this.nodes.clear()
        this.groups.clear()
        this.wires  = []
        this.arrows = []
        this.ports.clear()
        this.snapshotOfGroups.clear()
        this.snapshotOfNodes.clear()
        this.mount(this.root)
        return this
    }
    getTheme = () => this.context.theme
    // Theme dynamic switching
    useTheme(name: string) {
        if (this.context.theme === name) return this
        this.removeTheme()
        const link = document.createElement('link')
        link.href  = `theme-${name}.css`
        link.type  = 'text/css'
        link.rel   = 'stylesheet'
        document.head.appendChild(link)
        this.context.theme = name
        if (!this.context.keepSilence)
            console.info(`Use theme: ${this.context.theme}`)
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
    locate(e: Point) { return { x: e.x - this.rootRect.x, y: e.y - this.rootRect.y } }
    parse(data: GraphJson) {
        data.nodes.forEach(node => { this.createNode({ x: node.x, y: node.y, w: node.w, h: node.h, uuid: node.uuid }, node.ports) })
        data.wires.forEach(wire => { this.connect(wire.from, wire.to) })
        this.updateWire()
        return this
    }
    snapshot(): GraphJson {
        const self = this
        const data = { nodes: [], wires: [] }
        this.nodes.forEach(wnode => {
            const node = wnode.state
            const ports = []
            self.ports.forEach(wp => {
                const port = wp.state
                if (port.uuid === node.uuid)
                    ports.push(port)
            })
            data.nodes.push({ ...node, ports: ports })
        })
        this.wires.forEach(wire => {data.wires.push(wire.state)})
        return data
    }
    addWireValidation(fn: (_1: BasicPort, _2: BasicPort) => boolean) { this.linkageValidations.push(fn); return this }
    avoidSamePort() { return this.addWireValidation((from: BasicPort, to: BasicPort) => from.uuid === to.uuid && from.type === to.type && from.i === to.i) }
    avoidSameNode() { return this.addWireValidation((from: BasicPort, to: BasicPort) => from.uuid === to.uuid) }
    avoidSameType() { return this.addWireValidation((from: BasicPort, to: BasicPort) => from.type === to.type) }
    createNode(props?: Record<string, unknown>, ports?: Array<BasicPort>): Wrapper<BasicNode> {
        let node: BasicNode = { title: '', uuid: uuidv4(), x: 0, y: 0, w: undefined, h: undefined }
        Array.from(Object.keys(props)).forEach(k => { if (k in node) node[k] = props[k] })
        if (!this.context.keepSilence) {
            console.info(`create node :`)
            console.info(node)
        }
        if (ports === undefined || ports === null || ports.length === 0) {
            ports = this.buildDefaultPorts(node,
                <number>('inPortNumber'  in props ? props['inPortNumber' ] : 0),
                <number>('outPortNumber' in props ? props['outPortNumber'] : 0),
                <'horizontal' | 'vertical'>('permutation' in props ? props['permutation'] : 'horizontal'))
        }
        ports.forEach(port => { port.uuid = node.uuid; this.ports.set(this.portSign(port), new Wrapper<BasicPort>(port)) })
        const el = inject(this.root, this.generateNodeFragment(this.context, node, ports)) as HTMLDivElement
        node = reactive(node, buildGeometryInterceptors(el, this.context)) // state lift
        const handle = ({ default: () => el, handle: () => el.children[1] })[this.context.style]();
        // events binding
        handle.addEventListener('mousedown', (e: MouseEvent) => this.handleMouseDownOnNode(e, node.uuid))
        ports.forEach(port => {
            const el = document.getElementById(this.portSign(port))
            this.ports.get(this.portSign(port)).el = el
            el.addEventListener('mousedown', e => this.handleMouseDownOnPort(e, node, port))
            el.addEventListener('mouseup'  , e => this.handleMouseUpOnPort  (e, node, port))
        })
        const wrapper = Wrapper.bind<BasicNode>(node, el.children[0] as HTMLElement).refBy(bn => `node@${bn.uuid}`)
        this.nodes.set(node.uuid, wrapper)
        return wrapper
    }
    private buildDefaultPorts(node: BasicNode, inPortNumber: number, outPortNumber: number, permutation?: 'horizontal' | 'vertical') {
        if (node.w <= 0 || node.h <= 0) {
            if (!this.context.keepSilence)
                console.error(`Cannot create default ports for dynamic node!`)
            return []
        }
        const h = permutation || 'horizontal'
        const ports: Array<BasicPort> = []
        for (let i = 0; i < inPortNumber; i++) {
            h ? ports.push({uuid: node.uuid, x: 0, y: (node.h / (inPortNumber + 1)) * (i + 1), i, type: 0})
                : ports.push({uuid: node.uuid, x: (node.w / (inPortNumber + 1)) * (i + 1), y: 0, i, type: 0})
        }
        for (let i = 0; i < outPortNumber; i++) {
            h ? ports.push({uuid: node.uuid, x: node.w, y: (node.h / (outPortNumber + 1)) * (i + 1), i, type: 1})
                : ports.push({uuid: node.uuid, x: (node.w / (outPortNumber + 1)) * (i + 1), y: node.h, i, type: 1})
        }
        return ports
    }
    private updateWire() {
        for (let i = 0; i < this.wires.length; i++) {
            const wire = this.wires[i]
            const tp = this.convert(this, this.nodes.get(wire.state.to.uuid).state, wire.state.to)
            wire.ref().setAttribute('d', this.path_d(this.context.scale,
                this.convert(this, this.nodes.get(wire.state.from.uuid).state, wire.state.from), tp))
            if (this.context.arrow)
                this.placeArrow(this.arrows[i], tp, wire.state.to.type)
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
        const tp = this.convert(this, this.nodes.get(wire.state.to.uuid).state, wire.state.to)
        inject(this.palette, this.generateWireFragment(this.context,
            this.convert(this, this.nodes.get(wire.state.from.uuid).state, wire.state.from), tp,
            this.wireSign(wire.state)))
        this.wires.push(wire)
        if (this.context.arrow)
            this.arrows.push(this.createArrow(tp, to.type))
    }
    compose(nodes: Array<BasicNode>, bias: number = 10): Wrapper<Group> {
        const xMin = Math.min(...(nodes.map(node => node.x)))
        const xMax = Math.max(...(nodes.map(node => (node.x + node.w * this.context.scale))))
        const yMin = Math.min(...(nodes.map(node => node.y)))
        const yMax = Math.max(...(nodes.map(node => node.y + node.h * this.context.scale)))
        const g: Group = { uuid: uuidv4(), x: xMin - bias, y: yMin - bias, w: xMax - xMin + bias * 2, h: yMax - yMin + bias * 2, follower: nodes.map(x => x.uuid) }
        nodes.forEach(node => node.group = g.uuid)
        const el = inject(this.root, this.generateGroupFragment(this.context, g)) as HTMLDivElement
        el.addEventListener('mousedown', e => this.handleMouseDownOnGroup(e, g.uuid))
        const wrapper = Wrapper.createBy(reactive(g, buildGeometryInterceptors(el, this.context)), g => `group@${g.uuid}`)
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
    private handleMouseDownOnPort(e: MouseEvent, node: BasicNode, port: BasicPort) {
        if (this.menu !== null) this.menu.close()
        if (e.buttons === 1) {
            e.preventDefault()
            e.stopPropagation()
            this.begin = port
            this.iWire = inject(this.palette, this.generateWireFragment(this.context, this.convert(this, node, port),
                { x: e.clientX - this.rootRect.x, y: e.clientY - this.rootRect.y }, "iwire@" + uuidv4())) as SVGPathElement
            this.task = { type: 2, cursor: { x: e.clientX, y: e.clientY } }
        }
    }
    private handleMouseUpOnPort(e: MouseEvent, node: BasicNode, port: BasicPort) {
        this.connect(this.begin, port)
    }
    private handleMouseDownOnNode(e: MouseEvent, uuid: string) {
        if (this.menu !== null) this.menu.close()
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
    private handleMouseDownOnGroup(e: MouseEvent, uuid: string) {
        if (this.menu !== null) this.menu.close()
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
    private handleMouseDownOnGraph(e: MouseEvent) {
        if (this.menu !== null) this.menu.close()
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
        } else if (e.buttons === 2) {
            e.preventDefault()
            if (this.menu !== null)
                this.menu.open(e)
        }
    }
    private handleMouseMove(e: MouseEvent) {
        if (e.buttons === 1 && this.task.type === 1) {
            const snapshot = Array.from(this.snapshotOfNodes.values())[0]
            const node = this.nodes.get(snapshot.uuid)
            node.state.x = snapshot.x + e.clientX - this.task.cursor.x
            node.state.y = snapshot.y + e.clientY - this.task.cursor.y
        } else if (e.buttons === 1 && this.task.type === 2) {
            this.iWire.setAttribute('d', this.path_d(
                this.context.scale, this.convert(this, this.nodes.get(this.begin.uuid).state, this.begin),
                { x: e.clientX - this.rootRect.x, y: e.clientY - this.rootRect.y }))
        } else if (e.buttons === 1 && this.task.type === 4 && this.context.selection) {
            this.setFrame(e)
        } else if (e.buttons === 1 && this.task.type === 5) {
            this.moveGroup(e)
        } else if (e.buttons === 4 && this.task.type === 3) {
            const pass = ({ ctrl: () => e.ctrlKey, alt: () => e.altKey, none: () => true })[this.context.lock]()
            if (pass) {
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
        }
        this.updateWire()
    }
    private handleMouseUp(e: MouseEvent) {
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
    private handleWheel(e: WheelEvent) {
        const pass = ({ ctrl: () => e.ctrlKey, alt: () => e.altKey, none: () => true })[this.context.lock]()
        if (!pass) return
        e.preventDefault()
        const pivot = { x: e.clientX - this.rootRect.x, y: e.clientY - this.rootRect.y }
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
    private path_d = (scale: number, from: Point, to: Point) => {
        const arg = {p1dir: 'right', p2dir: 'left', p2x: 200, p1y: 200, p1x: 600, p2y: 300, scale: scale, delta: 30, wire: 'curve', edge: 6};
        arg.p1x = from.x; arg.p1y = from.y; arg.p2x = to.x; arg.p2y = to.y; return wirePath(arg)}
    private driveZoom(graph: Graph, scale: number) {
        graph.palette.setAttribute('stroke-width', String(1.6 * this.context.scale))
        graph.nodes .forEach(node  =>  node.ref().style.transform = `scale(${scale})`)
        graph.groups.forEach(group => group.ref().style.transform = `scale(${scale})`)
    }
    private generateNodeFragment(context: BasicContext, node: BasicNode, ports: Array<BasicPort>) {
        const style = `left: ${node.x}px; top: ${node.y}px;`
            + `${(node.w !== undefined && node.w > 0) ? `width: ${node.w}px;` : ''}`
            + `${(node.h !== undefined && node.h > 0) ? `height: ${node.h}px;` : ''}`
            + `transform: scale(${context.scale});`
            + `${context.style === 'handle' ? '' : 'cursor: move;'}`
        return (`<div id="node@${node.uuid}" class="node" style="${style}">
            <div class="custom-node"></div>
            ${context.style === 'handle' ? `<div class="handle" style="background-image: url('${SvgAnchor}');"></div>` : ''}
            ${context.title ? `<div class="title"><span>${node.title || ''}</span></div>` : ''}
            ${ports.map(port => (`<div 
                class="port" id="${this.portSign(port)}" 
                style="left: ${port.x - 5}px; top: ${port.y - 5}px; width: 10px; height: 10px;">
                <div class="custom-port"></div>
            </div>`)).join('')}
        </div>`)
    }
    private generateWireFragment(context: BasicContext, from: Point, to: Point, id: string) {
        return `<path class="wire ${context.wire === 'dynamic' ? 'dynamic-dash' : ''}" id="${id}" fill="none" d="${this.path_d(context.scale, from, to)}"></path>`
    }
    private generateGroupFragment(context: BasicContext, group: Group) {
        const style = `top: ${group.y}px; left: ${group.x}px; `
            + `width: ${group.w}px; height: ${group.h}px; `
            + `transform: scale(${context.scale});`
        return `<div id="group@${group.uuid}" 
                     class="group" style="${style}">
                     <div class="custom-group"></div>
                </div>`
    }
    private portSign = (port: BasicPort) => (`port@${port.type}@${port.i}@${port.uuid}`)
    private wireSign = (wire: BasicWire) => (`wire@${wire.from.type}@${wire.from.i}@${wire.from.uuid}@${wire.to.type}@${wire.to.i}@${wire.to.uuid}`)
    private convert  = (graph: Graph, node: BasicNode, port: BasicPort) => {
        return ({ x: node.x + port.x * graph.context.scale, y: node.y + port.y * graph.context.scale })
    }
    private setFrame = (e: MouseEvent = null) => {
        if (e === null) {
            if (this.frame === null)
                this.frame = inject(this.root, `<div class="frame"></div>`) as HTMLDivElement
            setStyleBox(this.frame, this.task.cursor.x - this.rootRect.x, this.task.cursor.y - this.rootRect.y, 0, 0)
            return
        }
        if (this.frame !== null) {
            const c1 = this.task.cursor.x - this.rootRect.x; const c2 = e.clientX - this.rootRect.x;
            const c3 = this.task.cursor.y - this.rootRect.y; const c4 = e.clientY - this.rootRect.y;
            const begin = { x: Math.min(c1, c2), y: Math.min(c3, c4) }
            const end   = { x: Math.max(c1, c2), y: Math.max(c3, c4) }
            setStyleBox(this.frame, begin.x, begin.y, Math.abs(end.x - begin.x), Math.abs(end.y - begin.y))
        }
    }
    private moveGroup(e: MouseEvent) {
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
    private updateAnimation() {
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
    changeWireStyle(type: 'dynamic' | 'static') {
        this.wires.forEach(wire => {wire.ref().setAttribute('class', `wire ${type === 'dynamic' ? 'dynamic-dash' : ''}`)})
    }
    private generateBackPanel() {
        return (`<svg class="overlay">
            <pattern id="pattern-hero" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"
                     patternTransform="translate(-0.5,-0.5)">
                <circle cx="0.5" cy="0.5" r="0.5" fill="#91919a"></circle>
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-hero)"></rect>
        </svg>`)
    }
    private createArrow(p: Point, der: number): SVGPathElement {
        const frag = `<path class="arrow" d="${this.arrow_d(p, this.context.scale, der)}"/>`
        return inject(this.palette, frag) as SVGPathElement
    }
    private placeArrow(el: SVGPathElement, p: Point, der: number) {
        el.setAttribute('d', `${this.arrow_d(p, this.context.scale, der)}`)
    }
    private arrow_d = ({x, y}, scale, der) => {
        if (der === 0)
            return (
                `M${x} ${y} L${x - 12 * scale} ${y - 6 * scale} ` +
                `L${x - 8 * scale} ${y} L${x - 12 * scale} ${y + 6 * scale} Z`)
        else
            return (
                `M${x} ${y} L${x + 12 * scale} ${y - 6 * scale} ` +
                `L${x + 8 * scale} ${y} L${x + 12 * scale} ${y + 6 * scale} Z`)
    }
}