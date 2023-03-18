// The light-weight ui framework, published with graph-engine!
import './panel.css'
import {inject} from "./jlib";

export class Descriptor {
    type: string;
    uuid?: string = '';
    name?: string = '';
    value?: any = '';
    label?: string = '';
    specific?: {
        options?: Array<{ label: string, value: any }>;
        placeholder?: string;
        click?: (_1: any) => void;
        background?: string;
        color?: string;
    };
    children?: Array<Descriptor> = [];
}

export class CyberPanel {
    root: HTMLElement
    context: Descriptor
    mount(el: HTMLElement, jsonDesc: Descriptor) {
        this.root = el;
        // this.root.className = 'overlay'
        this.context = jsonDesc;
        this.render()
        return this
    }
    render() {
        const el = inject(this.root, `<div></div>`) as HTMLElement
        el.className = 'panel-top-layer ' + (this.context.type === 'HLinearLayout' ? 'panel-h-container' : 'panel-v-container')
        this.parse(el, this.context)
        return this
    }
    refs: Map<string, HTMLElement> = new Map()
    types: Map<string, string> = new Map()
    parse(container: HTMLElement, context: Descriptor) {
        container.innerHTML = '' // Clear inner things first!
        const width = context.type === 'HLinearLayout' ? `${100 / context.children.length}%` : '100%'
        for (let i = 0; i < context.children.length; i++) {
            const child = context.children[i]
            const el = this.pile(container, child, width)
            if (['VLinearLayout', 'HLinearLayout'].indexOf(child.type) !== -1) {
                this.parse(el, child)
            }
        }
    }
    private valMap() {
        const vm = {}
        this.refs.forEach((el, name) => {
            const type = this.types.get(name)
            if (type === 'input')
                vm[name] = (el as HTMLInputElement).value
            if (type === 'number')
                vm[name] = parseFloat((el as HTMLInputElement).getAttribute('value'))
            if (type === 'textarea')
                vm[name] = (el as HTMLTextAreaElement).innerText
        })
        return vm
    }
    pile(el: HTMLElement, e: Descriptor, width: string): HTMLElement {
        let real = null
        const stopPropagation = rf => {
            rf.addEventListener('click', e => e.stopPropagation())
            rf.addEventListener('mousedown', e => e.stopPropagation())
            rf.addEventListener('mouseup', e => e.stopPropagation())
        }
        if (e.type === 'input') {
            real = inject(el, `<div class="panel-c" style="width: ${width};">
                <input class="panel-e" value="${e.value}" placeholder="${e.specific.placeholder}"/>
                <div class="panel-label">${e.label}</div>
            </div>`)
            stopPropagation(real)
            this.refs.set(e.name, real.firstChild)
            this.types.set(e.name, e.type)
        } else if (e.type === 'number') {
            real = inject(el, `<div class="panel-c" style="width: ${width};">
                <input class="panel-e" value="${e.value}" placeholder="${e.specific.placeholder}" type="number"/>
                <div class="panel-label">${e.label}</div>
            </div>`)
            stopPropagation(real)
            this.refs.set(e.name, real.firstChild)
            this.types.set(e.name, e.type)
        } else if (e.type === 'textarea') {
            real = inject(el, `<div class="panel-c" style="width: ${width};">
                <textarea class="panel-e" placeholder="${e.specific.placeholder}">${e.value}</textarea>
                <div class="panel-label">${e.label}</div>
            </div>`)
            stopPropagation(real)
            this.refs.set(e.name, real.firstChild)
            this.types.set(e.name, e.type)
        } else if (e.type === 'button') {
            real = inject(el, `<div class="panel-c" style="width: ${width};"><div class="panel-e glass pointer">${e.label}</div></div>`)
            if (e.specific.click !== undefined && e.specific.click !== null) {
                real.addEventListener('click', () => e.specific.click(this.valMap()))
                stopPropagation(real)
            }
        } else if (e.type === 'VLinearLayout') {
            real = inject(el, `<div style="width: ${width};" class="panel-v-container"></div>`)
        } else if (e.type === 'HLinearLayout') {
            real = inject(el, `<div style="width: ${width}; text-align: center;" class="panel-h-container"></div>`)
            real = el.lastElementChild
        } else if (e.type === 'label') {
            real = inject(el,`<div class="panel-c" style="width: ${width}; font-weight: bold; background: ${e.specific.background || '#333'};">
                <div class="panel-label" style=" color: ${e.specific.color || '#fff'};">${e.label}</div></div>`)
        } else {
            return null
        }
        return real
    }
}