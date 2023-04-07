import showdown from "showdown/dist/showdown.js"
import "./fonts/fonts-support.css"
import axios from "axios";
import highlight from "highlight.js"
import "highlight.js/styles/default.css"
import icons from "./icons"
import {select} from "minui/dist/interactive";

const inject = (el: Element, f: string): Element => {
    el.insertAdjacentHTML('beforeend', f)
    return el.lastChild as Element
}
const locate = (el: Element, xpath: string) => document.evaluate(xpath, el).iterateNext() as Element
const search = (el: Element, xpath: string) => {
    const result = document.evaluate(xpath, el)
    const r: Array<Element> = []
    let iter = null
    do {
        iter = result.iterateNext()
        if (!iter)
            r.push(iter as Element)
    } while (iter !== null)
    return r
}
const declareResponsiveWebsite = () =>
    inject(document.head, `<meta name="viewport" content="width=device-width, initial-scale=1.0">`)


const globalUniqueStyle: string = `<style>
:root {
    --border-color: #eef4ff; 
    --normal-font: ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
}
html body { font-family:  Roboto,"Helvetica Neue", "Microsoft YaHei", sans-serif; }
* { margin: 0; padding: 0; }
.overlay { position: absolute; top: 0; bottom: 0; left: 0; right: 0; }
.limited { margin-left: auto; margin-right: auto; max-width: 1024px; }
.pretty-rainbow-font {
    font-weight: 1000 !important;
    letter-spacing: -0.03em !important;
    background: linear-gradient(to right, #ff9e2f, #4d0baf);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}
.nav-item { box-sizing: border-box; padding-left: 1rem; padding-right: .75rem; margin-bottom: .25rem; height: 28px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; }
.nav-item * { transition: all .2s; }
.nav-item:hover {  }
.nav-item:hover label { color: #4096ff; }
.nav-item:hover svg { fill: #4096ff; }
.nav-item-select { background-color: rgba(230,230,250,0.25); }
.image-mask { width: 24px; height: 24px; background: url("/cool-background.png"); background-size: 24px 24px; 
    -webkit-mask-image: url("/star4.svg"); mask-image: url("/star4.svg"); mask-repeat: no-repeat; }
/* clear default style */
ul li { text-decoration: none; list-style-type: none; }
textarea[data-v-textarea] { resize: none; outline: none; appearance: none; border: none; background-color: #f8f8f8; border-radius: 0; }
/* here provide responsive style */
.responsive-row { display: flex; flex-wrap: wrap; }
@media screen and (max-width: 768px) {
.responsive-col-sm-12 { width: 100%; }
.responsive-sm-hide { display: none; }
.responsive-padding-edge { padding-left: 1rem; padding-right: 1rem;}
.responsive-navigation { display: none; }
}
@media screen and (min-width: 768px) {
.responsive-col-3 { width: 25%; }
.responsive-col-6 { width: 50%; }
.responsive-hide { display: none; }
.responsive-padding-edge { padding-left: 3rem; padding-right: 3rem;}
.responsive-navigation { width: 18rem; box-sizing: border-box; border-right: 1px solid var(--border-color); }
}
</style>`;
const globalSingletons = {
    gus: inject(document.head, globalUniqueStyle),
    foundationSupport: inject(document.head, `<link rel="stylesheet" href="/foundation.min.css">`)
}
const pageOfArticle = async () => {
    const query = window.location.search.substring(1)
    const queryMap = new Map()
    query.split('&').forEach(kv => {
        const k_v = kv.split('=')
        queryMap.set(k_v[0], k_v[1])
    })
    const article = await axios
        .get(`/articles/${queryMap.get('article') || 'not-found.md'}`)
        .then(resp => resp.data).catch(_ => `# Error\nWe cannot find related article for you!`)
    declareResponsiveWebsite()
    const converter = new showdown.Converter({tables: true})
    const page = inject(document.body, `<div style="position: absolute; top: 0; left: 0; width: 100%; display: flex; flex-direction: column;">
        <div style="width: 100%; height: 4rem;">
            <div class="limited" style="width: 100%; box-sizing: border-box; padding: 0 0.75rem; border-bottom: 1px solid var(--border-color); height: 4rem; display: flex; justify-content: space-between; align-items: center; color: #555;">
                <div style="display: flex; align-items: center;">
                    <div class="image-mask" style="margin-right: 1rem;"></div>
                    <label class="pretty-rainbow-font" style="cursor: default; font-size: 1.25rem; font-weight: bold; font-family: 'Maven Pro', Roboto, sans-serif;">Stars Picking</label>
                </div>
                <div>
                    <a href="https://www.github.com/aiyojun"><img alt="" src="/github.svg"/></a>
                </div>
            </div>
        </div>
        <div class="limited" style="width: 100%; box-sizing: border-box; padding: 0 0.75rem; min-height: calc(100vh - 7rem); display: flex;">
            <div class="article"></div>
        </div>
        <div class="limited" style="width: 100%; height: 3rem; line-height: 3rem; text-align: center; color: #888; font-size: .75rem; border-top: 1px solid var(--border-color);">Copyright © 2023, All rights reserved.</div>
    </div>`)
    const markdown = locate(page, '//div[@class="article"]')
    inject(markdown, converter.makeHtml(article))
    markdown.querySelectorAll('pre code').forEach(el => highlight.highlightBlock(el))
}

const pageOfHome = () => {
    const NavItem = (item: {name: string, icon: string, select: boolean, handle: Function}) => `<li class="nav-item${item.select ? ' nav-item-select' : ''}">
        <div style="display: flex; align-items: center;">
            <div style="margin-right: .4rem; width: 16px; height: 16px;">${icons.iconOf(item.icon, {width: 16, height: 16, fill: '#333'})}</div>
            <label>${item.name}</label>
        </div>
    </li>`
    const navigation = [
        { name: 'Home' , icon: 'home' , select: true, handle: Function },
        { name: 'Analysis', icon: 'chart', select: false, handle: Function },
    ]
    const page = inject(document.body, `<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column;">
        <div style="height: 4rem; border-bottom: 1px solid var(--border-color);">
            <div class="limited" class="responsive-padding-edge" style="max-width: 1536px; box-sizing: border-box; width: 100%; height: 100%; display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center;">
                    <div class="image-mask" style="margin-right: 1rem;"></div>
                    <label class="pretty-rainbow-font" style="cursor: default; font-size: 1.25rem; font-weight: bold; font-family: 'Maven Pro', Roboto, sans-serif;">Stars Picking</label>
                </div>
                <div style="display: flex; align-items: center;">
                    <div class="responsive-sm-hide" style="margin-right: .75rem;"><a href="https://www.github.com/aiyojun">${icons.iconOf('github', {width: 28, height: 28, fill: '#333'})}</a></div>
                    <div class="responsive-hide">${icons.iconOf('menu', {width: 32, height: 32, fill: '#333'})}</div>
                </div>
            </div>
        </div>
        <div class="limited" style="max-width: 1536px; width: 100%; min-height: calc(100% - 7rem); display: flex;">
            <div class="responsive-navigation">
                <ul style="margin: 1rem 2.25rem 1rem 2.25rem; font-size: .75rem;">
                    ${navigation.map(s => NavItem(s)).join('')}
                </ul>
            </div>
        </div>
        <div style="width: 100%; height: 3rem; border-top: 1px solid var(--border-color);">
            <div class="limited responsive-padding-edge" style="max-width: 1536px; box-sizing: border-box; width: 100%; height: 100%; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <span style="font-size: .75rem; color: #888; font-family: 'Source Sans Pro', sans-serif;">© Jun.Dai</span>
                </div>
                <div>
<!--                    <a style="font-size: .75rem; color: #888; font-family: 'Source Sans Pro', sans-serif;">寻求合作</a>-->
                </div>
            </div>
        </div>
    </div>`)
    const li = search(page, '//li[class="nav-item"]')
    for (let i = 0; i < navigation.length; i++) {
        (li[i] as HTMLLIElement).addEventListener('click', () => {

        })
    }
}

const AppMain = () => {
    pageOfHome()
}

AppMain()

// pageOfArticle()







