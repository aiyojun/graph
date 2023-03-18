import './cards.css'
import SvgPlay from '../assets/play.svg'

export class DescriptionCard {
    private readonly type: string;
    private readonly name: string;
    private readonly desc: string;
    private root: HTMLElement;
    constructor(type: string, name: string, desc: string)
    { this.type = type; this.name = name; this.desc = desc }
    mount(el: HTMLElement) {
        this.root = el
        this.render()
        return this
    }
    private render() {
        this.root.className = 'generic-container'
        this.root.innerHTML = (`<div class="generic-vision-card">
            <div class="generic-type">${this.type}</div>
            <div class="generic-name">${this.name}</div>
            <div class="generic-desc">${this.desc}</div>

        </div>`)
        return this
    }
}


export class TitleCard {
    private readonly title: string;
    private readonly name: string;
    private root: HTMLElement;
    constructor(title: string, name: string)
    { this.title = title; this.name = name }
    mount(el: HTMLElement) {
        this.root = el
        this.render()
        return this
    }
    private render() {
        this.root.className = 'generic-container'
        this.root.innerHTML = (`<div class="title-card">
            <div class="title-card-title">${this.title}</div>
            <div class="title-card-name">${this.name}</div>
        </div>`)
        return this
    }
}