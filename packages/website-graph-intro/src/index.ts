import {HomeOfStar} from "@/page/star";
import {defineRoute, UR} from "@/jlib";
import {PageOfArticle} from "@/page/mk";
import {ProdPage} from "@/vision/prod";
import {PageMarkdownGuide} from "@/page/mkguide";

const AppMain = () => {
    const home = new HomeOfStar()
    // home.mount(document.body)
    const clear = () => {
        const css = []
        for (let i = 0; i < document.head.children.length; i++) {
            const el = document.head.children
            if (el instanceof HTMLStyleElement) {
                css.push(el)
            }
        }
        css.forEach(x => x.remove())
        document.body.innerHTML = ''
    }
    defineRoute('/machine-vision', (ur: UR) => { clear(); new ProdPage().mount(document.body) })
    defineRoute('/article/toc', (ur: UR) => { clear(); PageMarkdownGuide(); })
    defineRoute('/article', (ur: UR) => { clear(); PageOfArticle(ur.toString()) })
    defineRoute(/[.]*/, (ur: UR) => { clear();home.mount(document.body);home.renderByRoute(ur) })
}

AppMain()









