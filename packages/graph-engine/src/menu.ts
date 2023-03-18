import {v4} from 'uuid'
import {inject} from "./jlib";
import './menu.css'
const uuidv4 = () => v4().replaceAll('-', '')

export type MenuItem = {
    icon?: string
    name: string
    shortcut?: string
    handle: Function
}

export class Menu {
    uuid: string = uuidv4()
    items: Array<MenuItem> = []
    self: Element = null
    private constructor() {}
    static create(items: Array<MenuItem>): Menu {
        const menu = new Menu()
        menu.items = items
        return menu
    }
    open(e: MouseEvent) {
        const el = document.getElementById(`menu@${this.uuid}`)
        if (el !== null) { el.remove() }
        this.self = inject(document.body, `<div id="menu@${this.uuid}" class="graph-menu"></div>`)
        const style = (this.self as HTMLDivElement).style
        style.top  = `${e.clientY}px`
        style.left = `${e.clientX}px`
        this.items.forEach(item => {
            const menuItem = inject(this.self, `<div class="graph-menu-item">
                <div class="graph-menu-name">${item.name}</div>
                <div class="graph-menu-shortcut">${item.shortcut || ''}</div>
            </div>`)
            menuItem.addEventListener('click', () => {
                try {
                    item.handle()
                    this.close()
                } catch (e) {
                    console.error(e)
                }
            })
        })
        return this
    }
    close() {
        if (this.self !== null)
            this.self.remove()
    }
}