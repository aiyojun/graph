import {defineRoute, UR} from "@/utils/jlib";
import {PageMarkdownGuide} from "@/page/mkguide";
import {PageOfArticle} from "@/page/mk";
import {HomeOfStar} from "@/page/star";
import {ProdPage} from "@/vision/prod";
import {locale} from "graph-engine";
import {PageModel} from "@/page/model";

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
        document.body.innerHTML = '<div id="root"></div>'
    }
    defineRoute('/model', (ur: UR) => { clear(); PageModel(document.getElementById('root')) })
    defineRoute('/machine-vision', (ur: UR) => {
        clear();
        if (ur.parameters.has('lang') && ur.parameters.get('lang') === 'zh')
            locale.lang('zh');
        new ProdPage().mount(document.body)
    })
    defineRoute('/article/toc', (ur: UR) => { clear(); PageMarkdownGuide(); })
    defineRoute('/article', (ur: UR) => { clear(); PageOfArticle(ur.toString()) })
    defineRoute(/[.]*/, (ur: UR) => { clear();home.mount(document.body);home.renderByRoute(ur) })
}

AppMain()









