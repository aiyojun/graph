import visionPlugins from '../data'
import {CyberPanel, Graph} from "graph-engine";

const macron = ['#03c9d5', '#f34676', '#ef7642', '#62d000', '#80CA98'];

export class VisionApp {
    private readonly graph: Graph
    constructor(graph: Graph) {
        this.graph = graph
        this.load()
    }
    load() {
        visionPlugins.plugins.forEach((plugin, pi) => {
            const node = this.graph.createNode({
                x: 1280 * Math.random(), y: 960 * Math.random(),
                w: 200, h: undefined,
            }, [
                { type: 0, x: 0, y: 10, i: 0, uuid: '' },
                { type: 1, x: 200, y: 10, i: 0, uuid: '' },
            ])
            const panel = new CyberPanel().mount(node.el, { type: 'VLinearLayout', children: [
                    { type: 'label', label: plugin.name, specific: { background: macron[pi % macron.length] } },
                    ...(plugin.context || [])
                ] })
        })
        return this
    }
}
