import * as url from "url";

export const inject = (el: Element, f: string): Element => {
    el.insertAdjacentHTML('beforeend', f)
    return el.lastChild as Element
}

export const locate = (el: Element, xpath: string) => document.evaluate(xpath, el).iterateNext() as Element

export const search = (el: Element, xpath: string) => {
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

export const declareResponsiveWebsite = () =>
    inject(document.head, `<meta name="viewport" content="width=device-width, initial-scale=1.0">`)

export const try_wrap = (caller: Function, ...args: any[]) => {
    if (caller === undefined)
        return
    try {
        return caller(...args)
    } catch (e) {
        console.error(e)
    }
}

export class UR {
    path: string = '';
    parameters: Map<string, string> = new Map();
    protocol: string = 'https:';
    host: string = '';

    static parse(url: string): UR {
        if (url === undefined) {
            console.info('reload page ...')
            window.location.reload()
            return null
            // window.location.href = `${window.location.protocol}//${window.location.host}`
        }
        const parsed = new UR()
        // console.info(`UR parse: ${url}; ${urlStack.stack[urlStack.seek]} ${urlStack.stack} ${urlStack.seek}`)
        const iPro = url.indexOf('://')
        let iPath = 0
        if (iPro !== -1) {
            parsed.protocol = url.substring(0, iPro)
            iPath += iPro + 3
        }
        let u = url.substring(iPath)
        const iRoot = u.indexOf('/')
        parsed.host = u.substring(0, iRoot) || window.location.host
        u = u.substring(iRoot)
        const iQm = u.indexOf('?')
        parsed.path = iQm === -1 ? u : u.substring(0, iQm)
        parsed.path ||= '/'
        if (iQm !== -1) {
            const kvq = u.substring(iQm + 1)
            kvq.split('&').forEach(g => {
                const kv = g.split('=')
                parsed.parameters.set(kv[0], kv[1])
            })
        }
        return parsed
    }

    toString() {
        const keys = Array.from(this.parameters.keys()).sort()
        const query = (keys || []).reduce((m, k) => m + `${k}=${this.parameters.get(k)}`, '?')
        return `${this.protocol}//${this.path}${query.length === 1 ? '' : query}`
    }
}

export type Route = { path: string | RegExp, handle: (url: UR) => void }

const urlStack: { stack: Array<string>, seek: number } = {stack: [], seek: -1}
const routers: Array<Route> = []

const renderByRouters = (uri: string) => {
    const url = UR.parse(uri)
    for (let i = 0; i < routers.length; i++) {
            // console.info(`render router: ${routers[i].path} ${url.path}`)
        if ((typeof routers[i].path === 'string' && routers[i].path === url.path) ||
            (routers[i].path instanceof RegExp && (url.path.match(routers[i].path) || []).length > 0)) {
            try_wrap(() => routers[i].handle(url))
            break
        }
    }
}

export const navigateTo = (url: string) => {
    // console.info(`navigate to: ${url}\n  ${urlStack.stack} ${urlStack.seek}`)
    if (url.length > 0 && url[0] === '/') {
        url = `${window.location.protocol}//${window.location.host}${url}`
        // console.info(`win protocol: ${window.location.protocol}`)
    }
    if (UR.parse(url).toString() ===
        UR.parse(urlStack.stack[urlStack.seek]).toString()) return
    history.pushState({routerSeek: urlStack.seek + 1}, document.title, url)
    urlStack.seek++
    if (urlStack.seek < urlStack.stack.length)
        urlStack.stack[urlStack.seek] = url
    else
        urlStack.stack.push(url)
    renderByRouters(urlStack.stack[urlStack.seek])
    return new Promise(resolve => resolve(urlStack.stack))
}

export const defineRoute = (path: string | RegExp, handle: (url: UR) => void) => {
    if (urlStack.stack.length === 0) {
        const uri = window.location.toString()
        urlStack.stack = []
        urlStack.stack.push(uri)
        urlStack.seek++
        window.addEventListener('load', () => { renderByRouters(uri) })
        window.addEventListener('popstate', () => {
            // console.info(`popstate seek: ${urlStack.seek}; stack: ${urlStack.stack}`)
            if (urlStack.seek === 0) {
                window.location.reload()
                return
            }
            urlStack.seek = (history.state !== null && 'routerSeek' in history.state) ? history.state['routerSeek'] : 0
            if (urlStack.seek < 0) return
            renderByRouters(urlStack.stack[urlStack.seek])
        })
    }
    routers.push({path, handle})
}