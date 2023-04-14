import {v4} from 'uuid'
import {inject} from "./jlib";
import {$T} from './locale'
import './menu.css'
import SvgRight from './assets/right.svg'
const uuidv4 = () => v4().replaceAll('-', '')

export type MenuItem = {
    icon?: string
    name: string
    shortcut?: string
    handle?: Function
    submenu?: Array<MenuItem>
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
    open(me: MouseEvent) {
        const x_abs = me.clientX
        const y_abs = me.clientY
        const el = document.getElementById(`menu@${this.uuid}`)
        if (el !== null) { el.remove() }
        this.self = inject(document.body, `<div id="menu@${this.uuid}" class="graph-menu"></div>`)
        const style = (this.self as HTMLDivElement).style
        style.top  = `${me.clientY}px`
        style.left = `${me.clientX}px`
        const secondary: Map<number, HTMLDivElement> = new Map()
        this.items.forEach((item, itemIndex) => {
            const menuItem = inject(this.self, `<div class="graph-menu-item">
                <div class="graph-menu-name">${$T(item.name)}</div>
                <div class="graph-menu-shortcut">
                    ${item.shortcut || ''}
                    ${item.submenu !== undefined ? `<img class="graph-menu-icon" src="${SvgRight}" alt=""/>` : ''}
                </div>
                <div class="graph-submenu graph-menu" style="display: none;">
                    ${this.renderSubmenu(item.submenu)}
                </div>
            </div>`)
            if (item.handle !== undefined) {
                menuItem.addEventListener('click', () => {
                    try {
                        item.handle({x: x_abs, y: y_abs})
                        this.close()
                    } catch (e) {
                        console.error(e)
                    }
                })
            }
            if (item.submenu !== undefined) {
                secondary.set(itemIndex, menuItem.lastElementChild as HTMLDivElement)
                const sec = secondary.get(itemIndex)
                for (let i = 0; i < sec.children.length; i++) {
                    let _el = sec.children[i] as HTMLDivElement
                    _el.addEventListener('click', () => {
                        try {
                            item.submenu[i].handle({x: x_abs, y: y_abs})
                            this.close()
                        } catch (e) {
                            console.error(e)
                        }
                    })
                }
                let opened = false
                const renderSubmenu = () => {
                    sec.style.display = 'block'
                    opened = true
                }
                let delayHandle
                menuItem.addEventListener('click', () => {})
                menuItem.addEventListener('mouseenter', () => {
                    delayHandle = setTimeout(renderSubmenu, 200)
                })
                menuItem.addEventListener('mouseleave', () => {
                    if (opened) {
                        secondary.forEach(div => div.style.display = 'none')
                    } else
                        clearTimeout(delayHandle)
                })
            }
        })
        return this
    }
    renderSubmenu(submenu: Array<MenuItem>) {
        if (submenu === undefined || submenu.length === 0) return ''
        return (`${
            submenu.map(item => {
                return (`<div class="graph-menu-item">
                <div class="graph-menu-name">${$T(item.name)}</div>
                <div class="graph-menu-shortcut">
                    ${item.shortcut || ''}
                    ${item.submenu !== undefined ? `<img class="graph-menu-icon" src="${SvgRight}" alt=""/>` : ''}
                </div>
            </div>`)
            }).join('')
        }`)
    }
    close() {
        if (this.self !== null)
            this.self.remove()
    }
}