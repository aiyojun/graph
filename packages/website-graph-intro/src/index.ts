import {inject} from "graph-engine";

const root = document.getElementById('root')

const routers = [
    { href: '/graph/home' },
    { href: '/graph/about' },
]
const state = { counter: 0 }
routers.forEach(router => {
    const link = inject(root, `<a>${router.href}</a>`) as HTMLLinkElement
    link.addEventListener('click', e => {
        e.preventDefault()
        state.counter++
        console.info(state)
        history.pushState(state, 'home.html', router.href)
    })
})
window.addEventListener('popstate', () => {
    console.info('popstate:')
    console.info(state)
})

