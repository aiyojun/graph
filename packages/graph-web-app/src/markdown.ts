import showdown from "showdown/dist/showdown.js"

const inject = (el: Element, f: string) => {
    el.insertAdjacentHTML('beforeend', f)
    return el.lastChild as Element
}
const locate = (el: Element, xpath: string) => document.evaluate(xpath, el).iterateNext() as Element
const responsiveWebsite = () => inject(document.head, `<meta name="viewport" content="width=device-width, initial-scale=1.0">`)

export class MarkdownEditor {
    converter = new showdown.Converter({tables: true})
    markdown: Element
    textarea: HTMLTextAreaElement
    static scopedStyle: HTMLStyleElement = null
    mount(el: Element) {
        responsiveWebsite()
        if (MarkdownEditor.scopedStyle === null) {
            MarkdownEditor.scopedStyle = inject(document.head, `<style>
                * { margin: 0; padding: 0; }
                textarea[data-v-textarea] {
                    resize: none;
                    outline: none;
                    appearance: none;
                    border: none;
                    background-color: #f8f8f8;
                    border-radius: 0;
                }
                .overlay {
                    position: absolute;
                    top: 0; bottom: 0; 
                    left: 0; right: 0;
                }
                .jd-row { display: flex; flex-wrap: wrap; }
                @media screen and (max-width: 768px) {
                    .jd-col-xs-12 { width: 100%; height: 50%; }
                }
                @media screen and (min-width: 768px) {
                    .jd-col-6  { width: 50%; height: 100%; }
                }
            </style>`) as HTMLStyleElement
        }
        const container = inject(el, `<div class="overlay jd-row">
            <textarea data-v-textarea class="jd-col-xs-12 jd-col-6" style="display: block;"></textarea>
            <div class="jd-col-xs-12 jd-col-6" style="box-sizing: border-box; padding: 1rem; overflow-y: auto;"></div>
        </div>`)
        this.textarea = locate(container, '//textarea') as HTMLTextAreaElement
        this.markdown = locate(container, 'div')
        this.textarea.value = '# Write your article'
        this.renderMarkdown()
        this.textarea.addEventListener('input', () => this.renderMarkdown())
    }
    renderMarkdown() {
        this.markdown.innerHTML = ''
        inject(this.markdown, this.converter.makeHtml(this.textarea.value))
    }
}

new MarkdownEditor()
    .mount(document.getElementById('root'))