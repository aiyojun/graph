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
    };
    children?: Array<Descriptor> = [];
}

export class CyberPanel {
    root: HTMLElement
    context: Descriptor
    mount(el: HTMLElement, jsonDesc: Descriptor) {
        this.root = el;
        this.root.className = 'overlay'
        this.context = jsonDesc;
        this.render()
        return this
    }
    render() {
        this.parse(this.root, this.context)
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
        if (e.type === 'input') {
            real = inject(el, `<input style="width: ${width};" class="panel-e" value="${e.value}" placeholder="${e.specific.placeholder}"/>`)
            this.refs.set(e.name, real)
            this.types.set(e.name, e.type)
        } else if (e.type === 'number') {
            real = inject(el, `<input style="width: ${width};" class="panel-e" value="${e.value}" placeholder="${e.specific.placeholder}" type="number"/>`)
            this.refs.set(e.name, real)
            this.types.set(e.name, e.type)
        } else if (e.type === 'textarea') {
            real = inject(el, `<textarea style="width: ${width};" class="panel-e" placeholder="${e.specific.placeholder}">${e.value}</textarea>`)
            this.refs.set(e.name, real)
            this.types.set(e.name, e.type)
        } else if (e.type === 'button') {
            real = inject(el, `<div style="width: ${width};" class="panel-e glass pointer">${e.label}</div>`)
            if (e.specific.click !== undefined && e.specific.click !== null) {
                real.addEventListener('click', () => e.specific.click(this.valMap()))
            }
        } else if (e.type === 'VLinearLayout') {
            real = inject(el, `<div style="width: ${width};" class="panel-v-container"></div>`)
        } else if (e.type === 'HLinearLayout') {
            real = inject(el, `<div style="width: ${width};" class="panel-h-container"></div>`)
            real = el.lastElementChild
        } else if (e.type === 'label') {
            real = inject(el,`<div style="width: ${width};" class="panel-e panel-label">${e.label}</div>`)
        } else {
            return null
        }
        return real
    }
}