import './generic.css'
import ImgMenu from './assets/menu.svg'
import ImgUser from './assets/dark-computer.jpg'
import ImgDropdown from './assets/sidebar-dropdown.svg'
import ImgHome from './assets/sidebar-home.svg'
const inject = (el: Element, frag: string) => {
    el.insertAdjacentHTML('beforeend', frag)
    return el.lastChild as Element;
}

const responsiveWebsite = () => {
    document.head.insertAdjacentHTML('beforeend',
        `<meta name="viewport" content="width=device-width, initial-scale=1.0">`)
}

export const introPage = (el: Element) => {
    responsiveWebsite()
    const page   = inject(el, `<div class="intro-page overlay"></div>`)
    const header = inject(page, `<header class="p-absolute">
        <div class="h-100 d-flex justify-content-space-between align-items-center c-limited padding-x-1 v-border">
            <div>
                <label>Product</label>
            </div>
            <div class="h-100">
                <div class="d-xs-only h-100 d-flex align-items-center">
                    <img src="${ImgMenu}" alt=""/>
                </div>
                <ul class="h-100 d-xs-none">
                    <li><div class="h-100 d-flex align-items-center">LinkA</div></li>
                    <li><div class="h-100 d-flex align-items-center">LinkB</div></li>
                    <li><div class="h-100 d-flex align-items-center">LinkC</div></li>
                    <li><span class="header-button">Prompt</span></li>
                </ul>
            </div>
        </div>
    </header>`)
    const main   = inject(page, `<main>
        <div>
            <div class="c-limited padding-x-1" style="padding: 3rem 0;">
                <div class="d-flex flex-direction-column align-items-center">
                    <h1>This is top title.</h1>

                </div>
            </div>
        </div>
        <div>
            <div class="c-limited row">
<!--                <div class="col-xs-12 col-6" style="background-color: pink; height: 400px;"></div>-->
<!--                <div class="col-xs-12 col-6" style="background-color: #4096ff; height: 400px;"></div>-->
            </div>
        </div>
    </main>`)
    const footer = inject(page, `<footer class="c-limited padding-x-1 d-flex flex-direction-column justify-content-center align-items-center">
        <span>Copyright © 2023 All rights reserved.</span>
    </footer>`)
}

export const productPage = (el: Element) => {
    responsiveWebsite()
    const page    = inject(el, `<div class="product-page overlay"></div>`)
    const header  = inject(page, `<header class="p-absolute">
        <div class="h-100 d-flex justify-content-space-between align-items-center padding-x-1 v-border">
            <div>
                <label>Product</label>
            </div>
            <div class="h-100 d-flex">
                <div class="d-xs-only h-100 d-flex justify-content-center align-items-center">
                    <img src="${ImgMenu}" alt=""/>
                </div>
                <div class="h-100 d-flex align-items-center d-xs-none">
                    <img class="user-icon" src="${ImgUser}" alt=""/>
<!--                    <span class="header-button">Prompt</span>-->
                </div>
            </div>
        </div>
    </header>`)
    const sidebar = inject(page, `<nav class="d-xs-none p-absolute">
        <div class="d-flex flex-direction-column h-100">
            <div class="d-flex flex-direction-column overflow-y-auto sidebar-vertical-content">
                <ul>
                    <li>
                        <div class="sidebar-item d-flex align-items-center sidebar-item-without-dropdown">
                            <img class="sidebar-item-icon" src="${ImgHome}" alt=""/>
                            <div>Home</div>
                        </div>
                        <div class="sidebar-label">PAGE</div>
                        <div class="sidebar-item d-flex align-items-center">
                            <div class="d-flex justify-content-center align-items-center sidebar-item-dropdown"><img src="${ImgDropdown}" alt=""/></div>
                            <img class="sidebar-item-icon" src="${ImgHome}" alt=""/>
                            <div>Others</div>                    
                        </div>
                    </li>
                </ul>
            </div>
            <div class="sidebar-vertical-footer"></div>
        </div>
    </nav>`)
    const main    = inject(page, `<main>
        <div class="product-content border-box">
            
        </div>
    </main>`)
    const footer  = inject(main, `<footer></footer>`);

    // const contextArea = (main.children[0] as HTMLDivElement)
    // for (let i = 0; i< 100; i++) {
    //     contextArea.insertAdjacentHTML('beforeend', `<p>This is a segment.</p>`)
    // }
}