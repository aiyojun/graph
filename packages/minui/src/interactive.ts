// Interactive widget definitions of phoenix framework
// Provided several basic UI controls
import SvgEye   from "@/assets/eye.svg";
import SvgDown  from "@/assets/down.svg";
import SvgPlus  from "@/assets/plus.svg";
import SvgHide  from "@/assets/hide.svg";
import SvgClose from "@/assets/close.svg";
import "@/index.css"
interface Option {
    label: string;
    value: any;
}
interface WidgetDescriptor {
    type: string;
    prop?: string;
    value?: any;
    label?: string;
    placeholder?: string;
    spellcheck?: boolean;
    options?: Array<Option>;
    required?: boolean;
    children?: Array<WidgetDescriptor>;
}
// Instance code fragment
export const inject = (el: Element, frag: string): Element => {
    el.insertAdjacentHTML('beforeend', frag)
    return el.lastChild as Element
}
const try_wrap = (caller: Function, ...args: any[]) => {
    if (caller === undefined)
        return
    try {
        caller(...args)
    } catch (e) {
        console.error(e)
    }
}
// The specific widget definition
export const label = (el: Element, param: WidgetDescriptor) =>
    inject(el, `<div class="uic-container">
        <span class="uic" style="font-weight: bold;">${param.label || ''}</span>
    </div>`)
// The inner implements: common methods
const fg_label = (param: WidgetDescriptor) => 'label' in param
    ? `<span class="uic uic-prefix-label">${param.label}</span>`
    : ''
// The input widget: support text/number type
export const input = (el: Element, param: WidgetDescriptor, onChange?: Function) => {
    const fg_input = `<div class="uic-input"><input class="uic"/></div>`
    const fg_group = `<div class="uic-container${(param.required || false) ? ' required-item' : ''}">
        ${fg_label(param)}${fg_input}</div>`
    const group = inject(el, fg_group)
    const input = group.lastChild.firstChild as HTMLInputElement
    if ('type'  in param) input.type  = param.type
    if ('value' in param) input.value = param.value
    if ('spellcheck'  in param) input.spellcheck  = param.spellcheck
    if ('placeholder' in param) input.placeholder = param.placeholder
    if (onChange !== undefined)
        input.addEventListener('input', () => {
            const value = (param.type || 'text') === 'number' ? parseFloat(input.value) : input.value
            try_wrap(onChange, value)
        })
    return group
}
export const button = (el: Element, param: WidgetDescriptor, onClick?: Function) => {
    const fg_button = `<div class="uic-button${'type' in param ? ` ${param.type}` : ''}">${param.value || 'Button'}</div>`
    const fg_group  = `<div class="uic-container${(param.required || false) ? ' required-item' : ''}">
        ${fg_label(param)}${fg_button}</div>`
    const group  = inject(el, fg_group)
    const button = group.lastChild as HTMLElement
    if (onClick !== undefined)
        button.addEventListener('click', () => try_wrap(onClick))
    return group
}
export const select = (el: Element, param: WidgetDescriptor, onChange?: Function) => {
    const fg_select = `<div class="uic-select"><span class="uic-normal-label">${param.options[0].label}</span><img class="uic-select-icon" src="${SvgDown}" alt=""/><div class="uic-options">${param.options.map(option => (`<div class="uic-option">${option.label}</div>`)).join('')}</div></div>`
    const fg_group  = `<div class="uic-container${(param.required || false) ? ' required-item' : ''}">${fg_label(param)}${fg_select}</div>`
    const group = inject(el, fg_group) as HTMLDivElement
    const background = group.lastChild as HTMLDivElement
    const options = group.lastChild. lastChild as HTMLDivElement
    const valFill = group.lastChild.firstChild as HTMLLabelElement
    const setSelectValue = (index: number) => {
        valFill.innerText = param.options[index].label
        try_wrap(onChange,  param.options[index].value)
    }
    if ('value' in param) {
        let index = -1;
        param.options.forEach((option, i) => { if (option.value === param.value) index = i; })
        setSelectValue(index !== -1 ? index : 0)
    }
    const closeOptions = () => { options.style.display = 'none' }
    document.addEventListener('click', closeOptions)
    background.addEventListener('click', (e: MouseEvent) => {
        e.preventDefault(); e.stopPropagation()
        options.style.display = options.style.display === 'block' ? 'none' : 'block'
    })
    for (let i = 0; i < options.children.length; i++) {
        options.children[i]
            .addEventListener('click', () => setSelectValue(i))
    }
    return group
}
export const switch$ = (el: Element, param: WidgetDescriptor, onChange?: Function) => {
    const fg_switch = `<span class="uic-switch"><span class="uic-switch-ball"></span></span>`
    const fg_group  = `<div class="uic-container${(param.required || false) ? ' required-item' : ''}">${fg_label(param)}${fg_switch}</div>`
    const group = inject(el, fg_group)
    const slider = group.lastChild.firstChild as HTMLSpanElement
    const background = group.lastChild as HTMLSpanElement
    let value = param.value || false
    const setSwitchValue = (b: boolean) => {
        if (b) {
            slider.style.left = '24px'
            slider.style.backgroundColor = '#4096ff'
        } else {
            slider.style.left = '2px'
            slider.style.backgroundColor = '#ddd'
        }
        value = b
        try_wrap(onChange, b)
    }
    setSwitchValue(value)
    background.addEventListener('click', () => setSwitchValue(!value))
    return group
}
export const radio = (el: Element, param: WidgetDescriptor, onChange?: Function) => {
    const fg_svg = (`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" class="uic-radio">
        <circle r="11" cx="12" cy="12" fill="none" stroke="#1677FF" stroke-width="1.6"/>
        <circle r="7" cx="12" cy="12" fill="#1677FF" stroke="none" />
    </svg>`)
    const fg_options = param.options.map(option => (`<div class="uic-radio-option">${fg_svg}<span class="uic">${option.label}</span></div>`)).join('')
    const fg_radio = `<div class="uic-radio-group">${fg_options}</div>`
    const fg_group = `<div class="uic-container${(param.required || false) ? ' required-item' : ''}">${fg_label(param)}${fg_radio}</div>`
    const group = inject(el, fg_group)
    let value = param.value || param.options[0].value
    const setRadioValue = (index: number, b: boolean) => {
        const radioOption = (group.lastChild as HTMLDivElement).children[index]
        const radio = radioOption.firstChild as SVGElement
        const outer = radio.children[0] as SVGCircleElement
        const inner = radio.children[1] as SVGCircleElement
        outer.setAttribute('stroke', b ? '#1677FF' : '#aaa')
        inner.setAttribute('fill'  , b ? '#1677FF' : 'none')
        value = param.options[index].value
        try_wrap(onChange, value)
    }
    const unset = () => { for (let i = 0; i < param.options.length; i++) setRadioValue(i, false) }
    const locate = (v: any) => {
        for (let i = 0; i < param.options.length; i++) {
            if (v === param.options.values()) return i
        }
        return 0
    }
    unset()
    setRadioValue(locate(value), true)
    for (let i = 0; i < param.options.length; i++) {
        const radioOption = (group.lastChild as HTMLDivElement).children[i]
        radioOption.addEventListener('click', () => {
            unset()
            setRadioValue(i, true)
        })
    }
    return group
}
export const checkbox = (el: Element, param: WidgetDescriptor, onChange?: Function) => {
    const fg_svg = (`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" class="uic-radio">
        <rect rx="6" ry="6" x="2" y="2" width="20" height="20" stroke="#aaa" stroke-width="1.6" fill="none"/>
        <path d="M6 12 L9 17 L18 7" stroke-linecap="round" stroke-linejoin="round" 
            fill="none" stroke-width="3.2" stroke="#fff"/>
    </svg>`)
    const fg_options  = param.options.map(option => (`<div class="uic-radio-option">
        ${fg_svg}<span class="uic">${option.label}</span></div>`)).join('')
    const fg_checkbox = `<div class="uic-radio-group">${fg_options}</div>`
    const fg_group = `<div class="uic-container${(param.required || false) ? ' required-item' : ''}">${fg_label(param)}${fg_checkbox}</div>`
    const group = inject(el, fg_group)
    let value = param.value || []
    let locate = (v: any) => {
        for (let i = 0; i < value.length; i++) {
            if (value[i] === v) return i
        }
        return -1
    }
    let seq = param.options.map(option => locate(option.value) !== -1)
    const setCheckboxOne = (index: number, b: boolean) => {
        const radioOption = (group.lastChild as HTMLDivElement).children[index]
        const svg = radioOption.firstChild as SVGElement
        const outer = svg.children[0] as SVGRectElement
        const right = svg.children[1] as SVGRectElement
        outer.setAttribute('stroke', b ? 'none' : '#aaa')
        outer.setAttribute('fill'  , b ? '#1677FF' : 'none')
        right.setAttribute('stroke', b ? '#fff' : 'none')
        seq[index] = b
        value = []
        seq.forEach((_b, i) => { if (_b) value.push(param.options[i].value) })
        try_wrap(onChange, value)
    }
    param.options.forEach((_, i) => setCheckboxOne(i, seq[i]))
    for (let i = 0; i < param.options.length; i++) {
        const radioOption = (group.lastChild as HTMLDivElement).children[i]
        radioOption.addEventListener('click', () => { setCheckboxOne(i, !seq[i]) })
    }
    return group
}
// Special containers
export const dynamic = (el: Element, param: WidgetDescriptor) => {
    const fg_plus = (`<img alt="" src="${SvgPlus}" class="uic-img"/>`)
    const fg_eye  = (`<img alt="" src="${SvgEye }" class="uic-img"/>`)
    const fg_hide = (`<img alt="" src="${SvgHide}" class="uic-img"/>`)
    const group = inject(el, `<div class="uic-container"><div class="uic-title-container">
        <span class="uic-title" style="font-weight: bold;">${param.label}</span>
        ${fg_plus}${fg_eye}${fg_hide}
    </div></div>`)
    const several = group.children[0]
    const elPlus = several.children[several.children.length - 3]
    const elEye  = several.children[several.children.length - 2]
    const elHide = several.children[several.children.length - 1]
    const subPanels: Array<PanelParser> = []
    const subElements: Array<HTMLDivElement> = []
    const hideList = () => subElements.forEach(e => e.style.display = 'none')
    const showList = () => subElements.forEach(e => e.style.display = 'block')
    elPlus.addEventListener('click', () => {
        showList()
        const c = inject(group, `<div class="uic-dynamic-container">
                <img alt="" src="${SvgClose}" class="uic-img uic-container-close" />
                <div class="uic-frame"></div>
            </div>`) as HTMLDivElement
        const close = c.children[0]
        const panel = new PanelParser().parse(c, param.children[0])
        const index = subPanels.length
        close.addEventListener('click', () => {
            c.remove()
            subPanels.splice(index, 1)
            subElements.splice(index, 1)
        })
        subPanels.push(panel)
        subElements.push(c)

    })
    elEye .addEventListener('click', () => showList())
    elHide.addEventListener('click', () => hideList())
    return group
}
// Generating user interactive panel by parsing a JSON
export class PanelParser {
    private readonly datalist = []
    parse(el: Element, context: WidgetDescriptor) {
        this.loop(el, context)
        return this
    }
    private loop(container: Element, context: WidgetDescriptor, width: string = '100%') {
        if (['VLinearLayout', 'HLinearLayout'].indexOf(context.type) !== -1) {
            const wrap = inject(container, `<div style="width: ${width};" 
                class="panel-${context.type === 'HLinearLayout' ? 'h' : 'v'}-container"></div>`)
            const subWidth = context.type === 'HLinearLayout' ? `${100 / context.children.length}%` : '100%'
            for (let i = 0; i < context.children.length; i++) {
                const child = context.children[i]
                this.loop(wrap, child, subWidth)
            }
            return
        }
        let pack = null
        let prop = null
        const setValue = (v, prop) => { prop.value = v; console.info(this.datalist) }
        switch (context.type) {
            case 'label':
                pack = label(container, context)
                break;
            case 'input':
            case 'number':
                prop = { field: context.prop || '', value: context.value || null }
                this.datalist.push(prop)
                pack = input(container, context, v => setValue(v, prop))
                break;
            case 'button':
                pack = button(container, context)
                break;
            case 'switch':
                prop = { field: context.prop || '', value: context.value || null }
                this.datalist.push(prop)
                pack = switch$(container, context, v => setValue(v, prop))
                break;
            case 'select':
                prop = { field: context.prop || '', value: context.value || null }
                this.datalist.push(prop)
                pack = select(container, context, v => setValue(v, prop))
                break;
            case 'radio':
                prop = { field: context.prop || '', value: context.value || null }
                this.datalist.push(prop)
                pack = radio(container, context, v => setValue(v, prop))
                break;
            case 'checkbox':
                prop = { field: context.prop || '', value: context.value || null }
                this.datalist.push(prop)
                pack = checkbox(container, context, v => setValue(v, prop))
                break;
            case 'dynamic':
                pack = dynamic(container, context)
                break;
        }
        if (pack !== null) {
            pack.style.width = width
        }
    }
}
// Todo: More functions support
//   1. specific the showing line number
//   2. page division
//   3. hide/show columns
export class Table<T> {
    root: Element
    header: Array<T>
    rows: Array<Array<T>>
    injectHeader: (e: Element, t: T) => Element
    injectCell  : (e: Element, t: T) => Element
    constructor(el: Element, header: Array<T>, data: Array<Array<T>>, fn1: (e: Element, t: T) => Element, fn2: (e: Element, t: T) => Element) {
        this.root   = el
        this.header = header
        this.rows   = data
        this.injectHeader = fn1
        this.injectCell   = fn2
        const table = inject(this.root, `<table class="j-table"><thead class="j-thead"><tr class="j-tr"></tr></thead><tbody class="j-tbody"></tbody></table>`)
        const headTr = table.firstChild.firstChild as Element
        const tbody  = table.lastChild as Element
        this.header.forEach(field => {
            const th = inject(headTr, `<th class="j-th"></th>`)
            this.injectHeader(th, field)
        })
        this.rows.forEach(row => {
            const tr = inject(tbody, `<tr class="j-tr"></tr>`)
            row.forEach((cell, col) => {
                const td = inject(tr, `<td class="j-td"></td>`)
                this.injectCell(td, cell)
            })
        })
        return this
    }
}
export class StaticTable extends Table<string> {
    constructor(el: Element, header: Array<string>, data: Array<Array<string>>)
    { super(el, header, data, (el, s) => inject(el, s), (el, s) => inject(el, s)) }
}
export class XTable extends Table<WidgetDescriptor> {
    constructor(el: Element, header: Array<WidgetDescriptor>, data: Array<Array<WidgetDescriptor>>) {
        super(el, header, data, (el, wd) => inject(el, wd.label), XTable.convert);
    }
    private static convert(el: Element, wd: WidgetDescriptor) {
        switch(wd.type) {
            case 'input':
            case 'number':
                return input(el, wd)
            case 'button':
                return button(el, wd)
            case 'radio':
            case 'select':
                return select(el, wd)
            case 'checkbox':
                return checkbox(el, wd)
        }
        return el
    }
}




