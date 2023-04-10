import {HomeOfStar} from "@/page/star";
import {defineRoute, UR} from "@/jlib";
import {PageOfArticle} from "@/page/mk";

const AppMain = () => {
    const home = new HomeOfStar()
    home.mount(document.body)
    const clear = () => document.body.innerHTML = ''
    defineRoute('/article', (ur: UR) => { clear(); PageOfArticle(ur.toString()) })
    defineRoute(/[.]*/, (ur: UR) => { clear();home.mount(document.body);home.renderByRoute(ur) })
}

AppMain()









