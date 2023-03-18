import './grid-system.css'

export class GridCard {
    private root: HTMLElement
    mount(el: HTMLElement) {
        this.root = el
        this.render()
        return this
    }

    render() {
        this.root.innerHTML = (`<div class="grid-card-top-layer">
            <div class="grid-card-row">
                <span>次表面半径</span>
            </div>
            <div class="grid-card-row">
                <span>次表面半径</span>
            </div>
        </div>`)
    }
}