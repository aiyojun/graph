import "@/fonts/fonts-support.css"
import "./generic.css"
import {tableOfContent} from "@/vision/def";
import icons from "@/utils/icons";
import zh from "@/vision/zh.json"
import {locale} from "graph-engine";
import {Graph} from "graph-engine";
import {VisionApp} from "@/vision";
import {v4} from "uuid"
import "./prod.css"
const uuidv4 = () => v4().replaceAll('-', '')

locale.load('zh', zh)
// locale.lang('zh')

const inject = (el: Element, f: string) => {
    el.insertAdjacentHTML('beforeend', f)
    return el.lastChild as Element
}
const responsiveWebsite = () => {
    document.head.insertAdjacentHTML('beforeend',
        `<meta name="viewport" content="width=device-width, initial-scale=1.0">`)
}

export class ProdPage {
    uuid: string = uuidv4();
    root: Element;
    main: Element;
    search: HTMLInputElement;
    palette: Element;
    pluginMap: Map<string, HTMLElement> = new Map()
    vision: VisionApp;
    mount(el: Element) {
        responsiveWebsite()
        this.root = inject(el, `<div class="overlay"></div>`)
        inject(this.root, `<header class="border-box w-100 padding-x-1 d-flex justify-content-space-between align-items-center">
            <div class="d-flex align-items-center">
                ${icons.iconOf('star4', {width: 28, height: 28, fill: 'var(--content-color)'})}
                <label style="margin-left: 1rem; font-weight: bold;">ALGORITHM PLATFORM</label>
            </div>
            <div class="d-flex align-items-center">
                <label class="h-100 pointer hover-color-blue" style="transition: color .2s; margin-left: 1rem;">CONTACT AUTHOR</label>
                <label class="h-100 pointer hover-color-blue" style="transition: color .2s; margin-left: 1rem;">ENTER GITHUB</label>
                <span class="pointer" style="margin-left: 1rem;">${icons.iconOf('github', {width: 32, height: 32, fill: 'var(--content-color)'})}</span>
            </div>
        </header>`)
        this.main = inject(this.root, `<main class="border-box w-100 d-flex" style="height: calc(100% - 4rem);">
            <div class="h-100 d-xs-none border-box" style="width: 15.875rem; padding: .5rem 0 .5rem .5rem;">
                <input class="user-friendly" placeholder="Search you want ..."/>
                <div class="w-100 border-box" style="position: relative; padding: 0 .25rem; font-size: .75rem; margin-top: .5rem; height: calc(100% - 36px - .5rem); overflow-y: auto; border-radius: 6px; background: rgba(255,255,255,0.03); box-shadow: 0 0 3px 1px rgba(0,0,0,0.05);">
                </div>
            </div>
            <div class="col-xs-12 main-content">
                <div class="w-100 h-100" style="position: relative; border-radius: 6px; background: rgba(255,255,255,0.03); box-shadow: 0 0 3px 1px rgba(0,0,0,0.05);">
                    <div class="spinner">
                        <div class="spinner-container container-1">
                            <div class="circle-1"></div>
                            <div class="circle-2"></div>
                            <div class="circle-3"></div>
                            <div class="circle-4"></div>
                        </div>
                        <div class="spinner-container container-2">
                            <div class="circle-1"></div>
                            <div class="circle-2"></div>
                            <div class="circle-3"></div>
                            <div class="circle-4"></div>
                        </div>
                    </div>
                    <div id="palette@${this.uuid}">
                    </div>
                </div>
            </div>
        </main>`)
        this.search = document.evaluate("//input", this.main).iterateNext() as HTMLInputElement
        this.palette = document.getElementById(`palette@${this.uuid}`)
        this.loadPlugins()
        this.search.addEventListener('input', () => this.loadPlugins())
        window.addEventListener('click', () => this.releasePlugins())

        console.info(this.palette)
        const graph = new Graph()
            .mount(this.palette)
            .useTheme('classic')

        this.vision = new VisionApp(graph)
        return this
    }
    loadPlugins() {
        let hasPlugin = false
        const plugins = document.evaluate("//main/div/div", this.main).iterateNext() as Element
        plugins.innerHTML = ''
        inject(plugins, `<style>ul li div {transition: all .2s;} ul li div:hover { background: yellowgreen; }</style>`)
        tableOfContent.plugins.forEach(g => {
            let ps = []
            if (g.plugins instanceof Array) {
                ps = g.plugins.filter(p => {
                    return p.name.toLowerCase().indexOf(this.search.value.toLowerCase()) !== -1
                });
            }
            if (ps.length === 0) return
            const ul = inject(plugins, `<div style="margin: .5rem; font-weight: bold;">${locale.$T(g.group)}</div><ul></ul>`)
            ps.forEach(p => {
                hasPlugin = true
                const f = `<li><div class="w-100 border-box d-flex align-items-center pointer" 
                                    style="border-radius: 6px; height: 32px; padding: .5rem; margin-top: .25rem;">
                                    ${icons.iconOf(p.icon, {width: 16, height: 16, fill: 'var(--content-color)'})}
                                    <span style="pointer-events: none; margin-left: .5rem;">${locale.$T(p.name)}</span>
                                </div></li>`
                const plugin = (inject(ul, f).children[0]) as HTMLElement
                this.pluginMap.set(p.name, plugin)
                plugin.addEventListener('click', (e: MouseEvent) => {
                    e.preventDefault()
                    e.stopPropagation()
                    this.releasePlugins()
                    this.pressPlugin(p.name)
                })
            })
        })
        if (!hasPlugin) {
            inject(plugins, `<div class="overlay flex-center" style="opacity: .9;">${icons.illustrationOf('no_data', {width: 260, height: 260})}</div>`)
        }
    }
    pressPlugin(name: string) {
        this.pluginMap.get(name).style.background = 'yellowgreen'
    }
    releasePlugins() {
        this.pluginMap.forEach(p => p.style.background = '')
    }
}

