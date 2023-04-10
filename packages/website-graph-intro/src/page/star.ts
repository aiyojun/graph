import "@/fonts/fonts-support.css"
import "./star.css"
import {inject, navigateTo, UR} from "@/jlib"
import ImageScene from "@/assets/scene.jpeg"
import icons from "@/icons"

export class HomeOfStar {

/*            <div style="width: 100%; height: 20rem; ${headerImage}; display: flex; flex-direction: column; color: #fff;">
                <div style="${limited}; height: 5.75rem; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0;">
                    <div style="${logoFont};">Stars Picking</div>
                    <div><a href="${linkGithub}">${icons.iconOf('github', {width: 32, height: 32, fill: '#fff'})}</a></div>
                </div>
                <div style="${limited}; padding-top: 1.25rem; padding-bottom: 1.25rem; margin-top: .75rem; margin-bottom: .75rem; background-color: rgba(48,48,48,.75); display: flex; flex-direction: column;">
                    <div style="font-size: 1.5rem; font-weight: bold;"></div>
                    <div style="font-size: 1rem; margin-top: 1.25rem;"></div>
                </div>
            </div>

            <div style="width: 100%; height: 5rem; background-color: #222; display: flex; flex-direction: column; color: #fff; position: sticky; top: 0;">
                <div style="${limited}; height: 5rem; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0;">
                    <div style="${logoFont};">Stars Picking</div>
                    <div><a href="${linkGithub}">${icons.iconOf('github', {width: 32, height: 32, fill: '#fff'})}</a></div>
                </div>
            </div>


            <div style="width: 100%; height: 5rem; display: flex; flex-direction: column; color: #fff; position: sticky; top: 0;">
                <div style="${limited}; height: 5rem; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0;">
                    <div style="${logoFont};">Stars Picking</div>
                    <div><a href="${linkGithub}">${icons.iconOf('github', {width: 32, height: 32, fill: '#fff'})}</a></div>
                </div>
            </div>

            */
    mount(el: Element) {
        const linkGithub = `https://www.github.com/aiyojun`
        const limited = `margin-left: auto; margin-right: auto; max-width: 1280px; box-sizing: border-box; padding: 0 1.25rem; width: 100%`
        const logoFont = `cursor: default; font-family: 'Times New Roman', Helvetica, san-serif; font-size: 1.25rem; font-weight: bold; font-style: italic;`
        // const logoFont = `cursor: default; font-family: alliance, Helvetica, san-serif; font-size: 1.25rem; font-weight: bold;`
        const headerImage = `background-image: url('${ImageScene}'); background-repeat: no-repeat; background-size: cover; background-position: top`
        inject(el, `<div style="position: absolute; top: 0; left: 0; width: 100%; display: flex; flex-direction: column; background-color: #222;">
            <div style="width: 100%; height: 16rem; ${headerImage}; display: flex; flex-direction: column; color: #fff;">
                <div style="${limited}; height: 5.75rem; display: flex; justify-content: space-between; align-items: center;">
                    <div style="${logoFont};">Stars Picking</div>
                    <div><a href="${linkGithub}">${icons.iconOf('github', {width: 32, height: 32, fill: '#fff'})}</a></div>
                </div>
            </div>

            
            <div style="width: 100%; min-height: calc(100vh - 9rem);">
<!--                <div style="width: 100%; height: 18rem; display: flex; flex-direction: column; color: #fff;">-->
<!--                </div>-->
<!--                <div style="width: 100%; height: 18rem; ${headerImage}; display: flex; flex-direction: column; color: #fff;">-->
<!--                </div>-->
                <div style="${limited};">
<!--                    <div style="text-align: left; border-left: 8px solid #232122; border-image: linear-gradient(lightskyblue, #ffb6c1) 30 30; padding-left: 1.25rem;">-->
<!--                        Content-->
<!--                    </div>-->
                </div>
                <div style="${limited}; padding: 0; display: flex; flex-wrap: wrap;">
<!--                    <div class="responsive-col-6 responsive-col-sm-12" style="background-color: darkseagreen; height: 400px;">-->
<!--                        <div class="j-bt" id="goAbout">Go About</div>-->
<!--                        <div class="j-bt" id="mkAcc1">graph-engine</div>-->
<!--                        <div class="j-bt" id="mkAcc2">graph-project</div>-->
<!--                    </div>-->
<!--                    <div class="responsive-col-6 responsive-col-sm-12" style="background-color: lightblue; height: 400px;"></div>-->
                </div>
            </div>
            <div style="width: 100%; height: 4rem; color: #fff;">
                <div style="${limited}; width: 100%; height: 100%; display: flex; align-items: center;"><span style="font-family: 'Times New Roman', sans-serif;">© Jun.Dai</span></div>
            </div>
        </div>`)
        // this.goTo = () => navigateTo('/about')
        // document.getElementById('goAbout').addEventListener('click', this.goTo)
        // document.getElementById('mkAcc1').addEventListener('click', () => { navigateTo('/article?article=graph-engine.md') })
        // document.getElementById('mkAcc2').addEventListener('click', () => { navigateTo('/article?article=graph-project.md') })
    }
    // goTo = () => {}
    renderByRoute(ur: UR) {
    //     const bt = document.getElementById('goAbout')
    //     bt.removeEventListener('click', this.goTo)
    //     if (ur.path.indexOf('about') === -1) {
    //         bt.innerText = 'Go About'
    //         this.goTo = () => navigateTo('/about')
    //     } else {
    //         bt.innerText = 'Go Home'
    //         this.goTo = () => navigateTo('/')
    //     }
    //     bt.addEventListener('click', this.goTo)
    }
}