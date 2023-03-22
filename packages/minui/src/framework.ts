window.addEventListener('popstate', () => {
    Router.stack.pop()
    // console.info(`[pop] Router stack: ${JSON.stringify(Router.stack.map(r => r.path))}`)
    const r = Router.stack[Router.stack.length - 1]
    // TODO: should rerender
    r.component.navigateTo(r.path, null, true)
})
export class Router {
    path: string;
    component: Component;
    static stack: Array<Router> = []
}
declare type JsonValue = string | number | boolean | null
export abstract class Component {
    hook: Element = null;
    parent: Component = null;
    routers: Array<Router> = [];
    abstract mount(el: Element);
    route(path: string, component: Component)
    { this.routers.push({ path, component }) }
    setHook(el: Element)
    { this.hook = el }
    setParent(c: Component)
    { this.parent = c }
    navigateTo(path: string, query?: Record<string, JsonValue>, back: boolean = false) {
        // console.info(`navigateTo: ${path}`)
        // console.info(window.location.pathname)
        if (!back && path === window.location.pathname) return
        let url = path
        if (query !== undefined && query !== null && Array.from(Object.keys(query)).length > 0) {
            url += '?' + Array.from(Object.keys(query)).reduce((merged, key) =>
                `${merged}$&&${key}={query[key]}`)
        }
        for (let i = 0; i < this.routers.length; i++) {
            const router = this.routers[i]
            if (router.path === path) {
                Router.stack.push({ path, component: this })
                history.pushState({}, document.title, url)
                // console.info(`Router stack: ${JSON.stringify(Router.stack.map(r => r.path))}`)
                // Router.forward(url)
                if (this.hook !== null) {
                    this.hook.innerHTML = ''
                    router.component.mount(this.hook)
                }
                break
            }
        }
    }
}