import {Graph, CyberPanel, inject, locale} from 'graph-engine'
import './fonts/roboto.css'
import {VisionApp} from "./vision";
import zh from './locale/zh.json'
import './global.css'

// locale.load('zh', zh)
// locale.lang('zh')

const graph = new Graph()
    .mount(document.getElementById('root'))
    .useTheme('classic')

new VisionApp(graph)

const panelRoot = inject(
    document.body,
    `<div style="box-shadow: 0 0 10px 5px rgba(0,0,0,0.25); position: fixed; top: 0; bottom: 0; right: 0; width: 240px; background: #333;"></div>`
)
const panel = inject(panelRoot, `<div id="panel"></div>`) as HTMLElement

new CyberPanel().mount(panel, {
    type: 'VLinearLayout',
    children: [
        {type: 'label', label: 'Control Panel'},
        {type: 'button', label: 'Use chinese', specific: { click: () => {  } }},
    ]
})