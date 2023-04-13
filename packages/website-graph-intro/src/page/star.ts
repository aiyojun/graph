import "@/fonts/fonts-support.css"
import "./star.css"
import {inject, navigateTo, UR} from "@/jlib"
import ImageScene from "@/assets/scene.jpeg"
import ImageScene2 from "@/assets/scenes_x001.jpg"
import ImageStar4 from "@/assets/star4.svg"
import ImageMV from "@/assets/electron-app2.png"
import ImagePic01 from "@/assets/scene_image.png"
import ImagePic02 from "@/assets/algo.png"
import ImagePic03 from "@/assets/ai.png"
import ImageFlow from "@/assets/flow.svg"
import ImageMV2 from "@/assets/machine-vision.svg"
import Video3dRendering from "@/assets/renderingcar.mp4"
import VideoSolidwords from "@/assets/drawing_converting.mp4"
import icons from "@/icons"

export class HomeOfStar {

/*            <div style="width: 100%; height: 20rem; ${headerImage}; display: flex; flex-direction: column; color: #fff;">
                <div style="height: 5.75rem; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0;">
                    <div style="${logoFont};">Stars Picking</div>
                    <div><a href="${linkGithub}">${icons.iconOf('github', {width: 32, height: 32, fill: '#fff'})}</a></div>
                </div>
                <div style="padding-top: 1.25rem; padding-bottom: 1.25rem; margin-top: .75rem; margin-bottom: .75rem; background-color: rgba(48,48,48,.75); display: flex; flex-direction: column;">
                    <div style="font-size: 1.5rem; font-weight: bold;"></div>
                    <div style="font-size: 1rem; margin-top: 1.25rem;"></div>
                </div>
            </div>

            <div style="width: 100%; height: 5rem; background-color: #2d2d2d; display: flex; flex-direction: column; color: #fff; position: sticky; top: 0;">
                <div style="height: 5rem; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0;">
                    <div style="${logoFont};">Stars Picking</div>
                    <div><a href="${linkGithub}">${icons.iconOf('github', {width: 32, height: 32, fill: '#fff'})}</a></div>
                </div>
            </div>


            <div style="width: 100%; height: 5rem; display: flex; flex-direction: column; color: #fff; position: sticky; top: 0;">
                <div style="height: 5rem; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0;">
                    <div style="${logoFont};">Stars Picking</div>
                    <div><a href="${linkGithub}">${icons.iconOf('github', {width: 32, height: 32, fill: '#fff'})}</a></div>
                </div>
            </div>



<a href="${linkGithub}">${icons.iconOf('github', { width: 32, height: 32, fill: '#fff' })}</a>

            */
    mount(el: Element) {
        const linkGithub = `https://www.github.com/aiyojun`
        const boundary = `box-sizing: border-box; padding: 0 1.25rem;`
        const border = `1px solid #414141`
        const limited = `margin-left: auto; margin-right: auto; max-width: 1280px; box-sizing: border-box; padding: 0 1.25rem; width: 100%`
        // const logoFont = `cursor: default; font-family: 'Times New Roman', Helvetica, san-serif; font-size: 1.25rem; font-weight: bold; font-style: italic;`
        const logoFont = `cursor: default; font-family: allianceExtra, Helvetica, san-serif; font-size: 1.25rem; font-weight: bold;`
        const zhFont = `font-family: alliance, 'Microsoft YaHei UI Light', 'Microsoft YaHei', sans-serif`
        const stdFont = `font-family: alliance, Helvetica, san-serif`
        const darkComputer = `background-image: url('${ImageScene}'); background-repeat: no-repeat; background-size: cover; background-position: top`
        const lightScene = `background-image: url('${ImageScene2}'); background-repeat: no-repeat; background-size: cover; background-position: center`
        const fontMask = `-webkit-background-clip: text; background-clip: text; color: transparent`
        const moduleTile = `padding: 0 1rem; font-size: 1.5rem; font-weight: bolder; ${fontMask}; font-family: alliance, 'Microsoft YaHei UI Light', 'Microsoft YaHei', sans-serif;`
        const moduleDesc = `padding: 0 1rem; font-size: 1rem; color: #fff; font-family: 'Microsoft YaHei UI Light', 'Microsoft YaHei', sans-serif`
        const tripleImages = `width: 20rem; margin-bottom: 2rem; border-radius: 8px;`
        const gradientBorder = ``
        const displayTripleImage = (img) => `<div style="background: url('${img}') no-repeat center; background-size: cover; width: 20rem; height: 20rem; border-radius: 10rem;"></div>`


        /*


        <div class="enter-button" style="color: #555; cursor: pointer; margin-left: 1rem; width: 12rem; height: 2rem; line-height: 2rem; text-align: center; padding: 0 1rem; background: linear-gradient(180deg, #aabeaa, darkseagreen); border-radius: 1rem; ${zhFont}; display: flex; align-items: center; justify-content: space-around;">
            <span>Enter Machine Vision</span>
            <span style="height: 100%; display: flex; align-items: center;">${icons.iconOf('enter', { width: 20, height: 20, fill: '#555' })}</span>
        </div>

        <div class="enter-button" style="color: #555; cursor: pointer; margin-left: 1rem; width: 12rem; height: 2rem; line-height: 2rem; text-align: center; padding: 0 1rem; background: linear-gradient(180deg, #aabeaa, darkseagreen); border-radius: 1rem; ${zhFont}; display: flex; align-items: center; justify-content: space-around;">
            <span>Enter Graph Repo</span>
            <span style="height: 100%; display: flex; align-items: center;">${icons.iconOf('enter', { width: 20, height: 20, fill: '#555' })}</span>
        </div>


        * */

        // language=HTML
        inject(el, `
            <div style="position: absolute; top: 0; left: 0; width: 100%; display: flex; flex-direction: column; background-color: #2d2d2d;">
                <div style="${boundary}; width: 100%; height: 4rem; display: flex; flex-direction: column; color: #fff; background-color: #2d2d2d; position: sticky; top: 0; z-index: 10;">
                    <div style="height: 100%; display: flex; justify-content: space-between; align-items: center;">
                        <div style="height: 100%; display: flex; align-items: center;">
                            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
                                 style="margin-right: 1rem;"
                                 width="24" height="24" stroke="#fff" stroke-width="120" fill="none">
                                <defs>
                                    <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" style="stop-color:whitesmoke;stop-opacity:1"/>
                                        <stop offset="100%" style="stop-color:lightskyblue;stop-opacity:1"/>
                                    </linearGradient>
                                </defs>
                                <path stroke="url('#rainbow')"
                                      d="M938 473.9L692 332 550.1 86c-16.9-29.4-59.3-29.4-76.3 0L332 332 86 473.9c-29.4 16.9-29.4 59.3 0 76.3L332 692l141.8 246c16.9 29.4 59.3 29.4 76.3 0L692 692l246-141.8c29.3-17 29.3-59.4 0-76.3z"></path>
                            </svg>
                            <div style="background: linear-gradient(to right, lightskyblue, lightpink); ${fontMask}; ${logoFont};">
                                Stars Picking
                            </div>
                        </div>
                        <div style="height: 100%; display: flex; align-items: center;">
                            <div class="pretty-header-button">Author</div>
                            <div class="pretty-header-button" 
                                 style="line-height: 1.25rem; text-align: center; display: flex; justify-content: center; align-items: center;" id="goMachineVision">
                                <span>Machine Vision</span>
                            </div>
                            <a href="${linkGithub}" class="pretty-header-button"
                               style="text-decoration: none; border-right: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center;">
                                <div>Github</div>
                                <div style="margin-left: .5rem; display: flex; align-items: center;">
                                    ${icons.iconOf('github', {width: 24, height: 24, fill: '#fff'})}
                                </div>
                            </a>
                        </div>
                    </div>
                </div>


                <div style="width: 100%; min-height: calc(100vh - 4rem - 4rem);">
                    <div style="${lightScene}; width: 100%; height: 22rem; display: flex; align-items: center; justify-content: center;">
                        <div style="display: flex; flex-direction: column; justify-content: center; height: 100%;">
                            <h1 style="color: #fff; text-shadow: 1px 1px 6px rgba(0,0,0,0.25); font-size: 3rem; font-weight: bolder; text-align: center;">
                                Stars Picking</h1><br>
                            <p style="padding: 0 1rem; font-size: 1.25rem; text-align: center; font-weight: bold; color: #fff;">
                                由Jun.Dai维护的个人网站，用于开源技术分享，深层技术解决方案展示，寻求合作。</p>
                        </div>
                    </div>

                    <!-- 介绍 机器视觉，算法平台 -->
                    <div style="width: 100%; background-color: rgba(255,255,255,0.05); padding: 5rem 0;">
                        <div style="${limited}; width: 100%; display: flex; flex-wrap: wrap; justify-content: space-around;">
                            <div class="responsive-col-6 responsive-col-sm-12"
                                 style="display: flex; justify-content: center; align-items: center;">
                                <img src="${ImageMV2}" alt=""
                                     style="height: 10rem; width: auto; transform: scale(.9);"/>
                            </div>
                            <div class="responsive-col-6 responsive-col-sm-12" style="display: flex; align-items: center;">
                                <div style="height: 10rem; width: 15px; background: linear-gradient(110deg, #B2DFF6 0%, #F7A49F 40%, #BCDDA1 100%); margin-right: .5rem;"></div>
                                <div style="display: flex; flex-direction: column; justify-content: space-around; height: 10rem;">
                                    <h1 style=" background: linear-gradient(110deg, #B2DFF6 0%, #F7A49F 40%, #BCDDA1 100%); ${moduleTile}; display: inline-block;">
                                        Machine Vision
                                    </h1>
                                    <p style="${moduleDesc}; color: #ddd; line-height: 1.75rem;">An open source machine vision platform
                                        designed for
                                        building vision algorithm flexibly ,
                                        consists of generic and primary image processing modules , advanced features
                                        detection for industrial ,
                                        and part of deep learning model.</p>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div style="width: 100%; padding: 5rem 0;">

                        <div style="${limited}; width: 100%; display: flex; flex-wrap: wrap; justify-content: space-around;">
                            <div class="responsive-col-6 responsive-col-sm-12" style="display: flex; align-items: center;">
                                <div style="height: 10rem; width: 15px; background: linear-gradient(110deg, lightskyblue, lightpink); margin-right: .5rem;"></div>
                                <div style="display: flex; flex-direction: column; justify-content: space-around; height: 10rem;">
                                    <h1 style="background: linear-gradient(110deg, lightskyblue, lightpink); ${moduleTile}; display: inline-block;">
                                        Topology Graph
                                    </h1>
                                    <p style="${moduleDesc}; color: #ddd; line-height: 1.75rem;">An open source machine vision platform
                                        designed for
                                        building vision algorithm flexibly ,
                                        consists of generic and primary image processing modules , advanced features
                                        detection for industrial ,
                                        and part of deep learning model.</p>
                                </div>
                            </div>
                            <div class="responsive-col-6 responsive-col-sm-12"
                                 style="display: flex; justify-content: center; align-items: center;">
                                <img src="${ImageFlow}" alt=""
                                     style="height: 14rem; width: auto; transform: scale(.9);"/>
                            </div>
                        </div>

                    </div>


                    <div style="width: 100%; background-color: rgba(255,255,255,0.05); box-sizing: border-box; padding: 4rem 1rem; display: flex; flex-direction: column;">
                        <div style="${limited}">
                            <h1 style="${moduleTile}; color: #fff; text-align: center;">技术文章</h1>

                            <div style="margin-top: 4rem; display: flex; flex-direction: column; cursor: pointer;"
                                 id="article_x01">
                                <div style="display: flex; align-items: center; color: #fff;">
                                    <div style="${moduleDesc}; padding: 0; margin-right: .5rem;">GraphEngine: 流图引擎
                                    </div>

                                </div>
                                <div style="display: flex; padding: 0; margin-top: 1rem; align-items: center;">
                                    ${icons.iconOf('chart', {width: 18, height: 18, fill: '#888'})}
                                    <div style="color: #888; margin-left: .5rem;">Jun.Dai</div>
                                </div>
                                <div style="${moduleDesc}; padding: 0; margin-top: 1rem; color: #888;">
                                    Graph是一个用节点和连线来描述事物模型的图形化工具。
                                    提供节点数据可视化，模块化编辑，数据的导入和导出等功能。
                                    使用Typescript编写，由原生DOM api渲染，无任何前端框架侵入，性能达到极致。
                                    子项目graph-engine是Graph的核心渲染引擎，可作为node_module进行导入。
                                    提供极简api调用。
                                    可与任意前端框架(react/vue)集成。
                                    支持electron本地化部署。
                                </div>
                                <div style="${moduleDesc}; padding: 0; margin-top: 1rem; color: #888;">
                                    2023.04.11
                                </div>
                            </div>

                            <div style="margin-top: 4rem; display: flex; flex-direction: column; cursor: pointer;"
                                 id="article_x02">
                                <div style="display: flex; align-items: center; color: #fff;">
                                    <div style="${moduleDesc}; padding: 0; margin-right: .5rem;">GraphEngine: 流图引擎
                                    </div>

                                </div>
                                <div style="display: flex; padding: 0; margin-top: 1rem; align-items: center;">
                                    ${icons.iconOf('chart', {width: 18, height: 18, fill: '#888'})}
                                    <div style="color: #888; margin-left: .5rem;">Jun.Dai</div>
                                </div>
                                <div style="${moduleDesc}; padding: 0; margin-top: 1rem; color: #888;">
                                    Graph是一个用节点和连线来描述事物模型的图形化工具。
                                    提供节点数据可视化，模块化编辑，数据的导入和导出等功能。
                                    使用Typescript编写，由原生DOM api渲染，无任何前端框架侵入，性能达到极致。
                                    子项目graph-engine是Graph的核心渲染引擎，可作为node_module进行导入。
                                    提供极简api调用。
                                    可与任意前端框架(react/vue)集成。
                                    支持electron本地化部署。
                                </div>
                                <div style="${moduleDesc}; padding: 0; margin-top: 1rem; color: #888;">
                                    2023.04.11
                                </div>
                            </div>


                            <div id="goMoreArticles" style="margin-top: 3rem; height: 2rem; display: flex; justify-content: flex-start; align-items: center; cursor: pointer;">
                                ${icons.iconOf('enter', { width: 20, height: 20, fill: '#fff' })}
                                <span style="font-family: 'Microsoft YaHei UI Light', 'Microsoft YaHei', sans-serif; color: #fff; text-align: center; margin-left: .5rem;">更多文章</span>
                            </div>
                        </div>
                    </div>


                    <div style="padding: 0; display: flex; flex-wrap: wrap;">
                        <!--                    <div class="responsive-col-6 responsive-col-sm-12" style="background-color: darkseagreen; height: 400px;">-->
                        <!--                        <div class="j-bt" id="goAbout">Go About</div>-->
                        <!--                        <div class="j-bt" id="mkAcc1">graph-engine</div>-->
                        <!--                        <div class="j-bt" id="mkAcc2">graph-project</div>-->
                        <!--                    </div>-->
                        <!--                    <div class="responsive-col-6 responsive-col-sm-12" style="background-color: lightblue; height: 400px;"></div>-->
                    </div>
                </div>
                <div style="width: 100%; height: 4rem; color: #fff; box-sizing: border-box; border-top: ${border};">
                    <div style="${boundary}; width: 100%; height: 100%; display: flex; justify-content: space-between; align-items: center;">
                        <span style="${stdFont}">© Jun.Dai</span>
                        <div style="display: flex; height: 100%; align-items: center;">
                            <!--                            <a class="pretty-link">Blog</a>-->
                            <!--                            <a class="pretty-link">Contact</a>-->
                            <!--                            <a class="pretty-link">FAQ</a>-->
                        </div>
                    </div>
                </div>
            </div>`)


        /*
                        <div class="responsive-col-3 responsive-col-sm-12" style="display: flex; justify-content: center;">
                            <span style="${stdFont}">© Jun.Dai</span>
                        </div>
                        <div class="responsive-col-3 responsive-col-sm-12" style="display: flex; justify-content: center;">
                            <ul>
                                <li class="pretty">FAQ</li>
                                <li class="pretty">Contact</li>
                                <li class="pretty">Blog</li>
                            </ul>
                        </div>


                            <div style="${boundary}; width: 100%; height: 100%; display: flex; align-items: center;"><span
                            style="${stdFont}">© Jun.Dai</span></div>


        * */

        document.getElementById('goMachineVision')
            .addEventListener('click', () => {
                navigateTo('/machine-vision')
            })
        document.getElementById('goMoreArticles')
            .addEventListener('click', () => {
                navigateTo('/article/toc')
            })
        document.getElementById('article_x01')
            .addEventListener('click', () => {
                navigateTo('/article?article=graph-engine.md')
            })
        document.getElementById('article_x02')
            .addEventListener('click', () => {
                navigateTo('/article?article=graph-project.md')
            })

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