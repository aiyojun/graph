import visionPlugins from '../data'
import {CyberPanel, Graph, locale, MenuItem} from "graph-engine";
const $T = locale.$T

const rowHeight = 12
const cardWidth = 200

export class VisionApp {
    private readonly graph: Graph
    constructor(graph: Graph) {
        this.graph = graph
        this.load()
    }
    createPluginInstance(pos, plugin) {
        const { x, y } = this.graph.locate(pos)
        console.info(`${pos.x}, ${pos.y} ${x}, ${y}`)
        const node = this.graph.createNode({
            x, y, w: cardWidth, h: undefined,
        }, [
            { type: 0, x: 0, y: rowHeight, i: 0, uuid: '' },
            { type: 1, x: cardWidth, y: rowHeight, i: 0, uuid: '' },
        ])
        const panel = new CyberPanel().mount(node.el, { type: 'VLinearLayout', children: [
                { type: 'label', label: plugin.name, specific: { background: plugin.color } },
                ...(plugin.context || [])
            ] })
    }
    load() {
        // group first
        const groups: Map<string, Array<any>> = new Map()
        visionPlugins.plugins.forEach(plugin => {
            // plugin.name = $T(plugin.name)
            // plugin.type = $T(plugin.type)
            // if ('context' in plugin) {
            //     plugin.context.forEach(item => {
            //         item.label = $T(item.label)
            //     })
            // }
            const group = plugin.type
            if (!groups.has(group))
                groups.set(group, [])
            groups.get(group).push(plugin)
        })
        const sortedGroupKeys = Array.from(groups.keys()).sort()
        const menuList: Array<MenuItem> = []
        sortedGroupKeys.forEach((group) => {
            menuList.push({
                name: group, submenu: groups.get(group).map(plugin => ({name: plugin.name, handle: (_pos) => {
                        this.createPluginInstance(_pos, plugin)
                    }}))
            })
        })
        this.graph.setMenu(menuList)
        return this
    }
}
