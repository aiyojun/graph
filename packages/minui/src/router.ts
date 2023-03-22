import {Component, Router} from "@/framework";
import {inject, PanelParser, XTable} from "@/interactive";
import {templateJson1, templateJson2} from "@/data";

export class VxCom extends Component {
    parent: Component = null;
    routers: Array<Router> = [];
    constructor() {
        super()
        this.route('/phoenix', new class extends Component {
            mount(el: Element) {
                new PanelParser().parse(el, templateJson1)
            }
        })
        this.route('/phoenix/about', new class extends Component {
            mount(el: Element) {
                const hideLabel = (wd) => {
                    const cp = JSON.parse(JSON.stringify(wd))
                    delete cp.label
                    return cp
                }
                new XTable(el,
                    templateJson2.children,
                    [
                        templateJson2.children.map(hideLabel),
                        templateJson2.children.map(hideLabel),
                        templateJson2.children.map(hideLabel),
                    ]
                )
            }
        })
    }
    mount(el: Element) {
        const ul = inject(el, `<div><ul>
            <li><a>form</a></li>
            <li><a>table</a></li>
        </ul><div></div></div>`);
        this.hook = ul.lastChild  as Element
        (ul.firstChild as Element).children[0].addEventListener('click', () => {
            this.navigateTo('/phoenix')
        });
        (ul.firstChild as Element).children[1].addEventListener('click', () => {
            this.navigateTo('/phoenix/about')
        });
    }
}

new VxCom().mount(document.body)



// import {PanelParser, XTable} from "@/interactive";
// import {templateJson1, templateJson2} from "@/data";
//
// console.info(window.location)
// console.info(JSON.stringify(window.location))
//
//
// const routers = [
//     {
//         path: '/phoenix',
//         entry: () => {
//             new PanelParser().parse(document.body, templateJson1)
//         }
//     },
//     {
//         path: '/phoenix/about',
//         entry: () => {
//             const hideLabel = (wd) => {
//                 const cp = JSON.parse(JSON.stringify(wd))
//                 delete cp.label
//                 return cp
//             }
//             new XTable(document.body,
//                 templateJson2.children,
//                 [
//                     templateJson2.children.map(hideLabel),
//                     templateJson2.children.map(hideLabel),
//                     templateJson2.children.map(hideLabel),
//                 ]
//             )
//         }
//     },
// ]
//
// console.info(window.location.pathname)
// for (let i = 0; i < routers.length; i++) {
//     const router = routers[i]
//     if (window.location.pathname === router.path) {
//         console.info(`enter => ${router.path}`)
//         router.entry()
//         break
//     }
// }
//
