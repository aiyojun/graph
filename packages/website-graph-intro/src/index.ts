import showdown from "showdown/dist/showdown.js"
import "./fonts/roboto.css"
import axios from "axios";

const inject = (el: Element, f: string): Element => {
    el.insertAdjacentHTML('beforeend', f)
    return el.lastChild as Element
}
const locate = (el: Element, xpath: string) => document.evaluate(xpath, el).iterateNext() as Element
const declareResponsiveWebsite = () =>
    inject(document.head, `<meta name="viewport" content="width=device-width, initial-scale=1.0">`)


const globalUniqueStyle: string = `<style>
:root {
    --border-color: #eef4ff; 
    --normal-font: ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
}
* { margin: 0; padding: 0; }
.overlay { position: absolute; top: 0; bottom: 0; left: 0; right: 0; }
.limited { margin-left: auto; margin-right: auto; max-width: 960px; }
/* clear default style */
textarea[data-v-textarea] { resize: none; outline: none; appearance: none; border: none; background-color: #f8f8f8; border-radius: 0; }
/* here provide responsive style */
.responsive-row { display: flex; flex-wrap: wrap; }
@media screen and (max-width: 768px) {
.responsive-col-sm-12 { width: 100%; }
}
@media screen and (min-width: 768px) {
.responsive-col-3 { width: 25%; }
.responsive-col-6 { width: 50%; }
}
</style>`;
const globalSingletons = {
    gus: inject(document.head, globalUniqueStyle),
    foundationSupport: inject(document.head, `<link rel="stylesheet" href="http://cdn.static.runoob.com/libs/foundation/5.5.3/css/foundation.min.css">`)
}
const pageOfArticle = () => {
    declareResponsiveWebsite()
    const converter = new showdown.Converter({tables: true})
    const page = inject(document.body, `<div style="position: absolute; top: 0; left: 0; width: 100%; display: flex; flex-direction: column;">
        <div style="width: 100%; height: 4rem;">
            <div class="limited" style="width: 100%; box-sizing: border-box; padding: 0 0.75rem; border-bottom: 1px solid var(--border-color); height: 4rem; display: flex; justify-content: space-between; align-items: center; color: #555;">
                <div>
                    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
                    width="24" height="24" stroke="#333" stroke-width="80" fill="none">
                    <path d="M938 473.9L692 332 550.1 86c-16.9-29.4-59.3-29.4-76.3 0L332 332 86 473.9c-29.4 16.9-29.4 59.3 0 76.3L332 692l141.8 246c16.9 29.4 59.3 29.4 76.3 0L692 692l246-141.8c29.3-17 29.3-59.4 0-76.3z"></path>
                    </svg>
                </div>
                <div>
                    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
                    width="16" height="16" stroke="#333" stroke-width="80" fill="none">
                    <path d="M938 473.9L692 332 550.1 86c-16.9-29.4-59.3-29.4-76.3 0L332 332 86 473.9c-29.4 16.9-29.4 59.3 0 76.3L332 692l141.8 246c16.9 29.4 59.3 29.4 76.3 0L692 692l246-141.8c29.3-17 29.3-59.4 0-76.3z"></path>
                    </svg>
                    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
                    width="16" height="16" stroke="#333" stroke-width="80" fill="none">
                    <path d="M938 473.9L692 332 550.1 86c-16.9-29.4-59.3-29.4-76.3 0L332 332 86 473.9c-29.4 16.9-29.4 59.3 0 76.3L332 692l141.8 246c16.9 29.4 59.3 29.4 76.3 0L692 692l246-141.8c29.3-17 29.3-59.4 0-76.3z"></path>
                    </svg>
                    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
                    width="16" height="16" stroke="#333" stroke-width="80" fill="none">
                    <path d="M938 473.9L692 332 550.1 86c-16.9-29.4-59.3-29.4-76.3 0L332 332 86 473.9c-29.4 16.9-29.4 59.3 0 76.3L332 692l141.8 246c16.9 29.4 59.3 29.4 76.3 0L692 692l246-141.8c29.3-17 29.3-59.4 0-76.3z"></path>
                    </svg>
                </div>
            </div>
        </div>
        <div class="limited" style="width: 100%; box-sizing: border-box; padding: 0 0.75rem;">
        </div>
        <div class="limited" style="width: 100%; text-align: center; color: #888; font-size: .75rem; padding: 1rem 0; border-top: 1px solid var(--border-color);">Copyright © 2023, All rights reserved.</div>
    </div>`)
    const markdown = locate(page, 'div[2]')
    axios.get('/src/dist/README.md').then(resp => {
        inject(markdown, converter.makeHtml(resp.data))
    })
}

pageOfArticle()







