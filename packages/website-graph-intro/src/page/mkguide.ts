import {inject, navigateTo} from "@/utils/jlib";
import icons from "@/utils/icons"
import "@/fonts/fonts-support.css"
import {Article, readGuideJson} from "@/page/mkdoc";






export const PageMarkdownGuide = async () => {

    const articles = (await readGuideJson()) as Array<Article>
    articles.forEach((x, i) => x.uuid = `article_${i}`)

    const pageNumber = 20
    const pageNo = `box-sizing: border-box; border: 1px solid #555; border-radius: .25rem; width: 1.25rem; height: 1.25rem; font-size: .75rem; font-family: Roboto, san-serif; cursor: pointer; margin-right: .5rem`
    const topLayer = `position: absolute; top: 0; left: 0; width: 100%; display: flex; flex-direction: column`
    const limited = `max-width: 1280px; margin-left: auto; margin-right: auto; width: 100%; box-sizing: border-box; padding: 0 1.25rem`
    const header = `height: 4rem; display: flex; justify-content: space-between; align-items: center`
    const flexCenter = `display: flex; justify-content: center; align-items: center`
    const logoFont = `cursor: default; font-family: allianceExtra, Helvetica, san-serif; font-size: 1.25rem; font-weight: bold`
    const stdFont = `font-family: alliance, Helvetica, san-serif`
    const fontMask = `-webkit-background-clip: text; background-clip: text; color: transparent`
    const searchFrame = `display: inline-block;
    width: 100%;
    box-sizing: border-box;
    padding-left: 2rem;
    padding-right: 2rem;
    height: 2.8rem;
    line-height: 2.8rem;
    outline: none;
    border: 1px solid var(--border-color);
    border-radius: 2.8rem;
    background: rgba(255,255,255,0);
    color: #eee;
    font-size: 1rem;
    font-family: Nunito, Roboto, Helvetica, 'Microsoft YaHei UI Light', 'Microsoft YaHei', sans-serif;
    transition: border .2s`
    const normalTitle = `padding: 0 1rem; font-size: 1.5rem; font-weight: bolder; font-family: alliance, 'Microsoft YaHei UI Light', 'Microsoft YaHei', sans-serif;; display: inline-block`


    const buildArticleDom = (article: Article) => (`
        <div style="margin-top: 4rem; display: flex; flex-direction: column; cursor: pointer;" id="${article.uuid}">
            <div style="display: flex; align-items: center; color: #fff;">
                <div style="font-size: 1rem; color: #fff; font-family: 'Microsoft YaHei UI Light', 'Microsoft YaHei', sans-serif; padding: 0; margin-right: .5rem;">${article.title}</div>
            </div>
            <div style="display: flex; padding: 0; margin-top: 1rem; align-items: center;">
                ${icons.iconOf('chart', {width: 18, height: 18, fill: '#888'})}
                <div style="color: #888; margin-left: .5rem;">${article.author}</div>
            </div>
            <div style="font-size: 1rem; font-family: 'Microsoft YaHei UI Light', 'Microsoft YaHei', sans-serif; padding: 0; margin-top: 1rem; color: #888;">${article.abstract}</div>
            <div style="font-size: 1rem; font-family: 'Microsoft YaHei UI Light', 'Microsoft YaHei', sans-serif; padding: 0; margin-top: 1rem; color: #888;">${article.create_time}</div>
        </div>`)


    const buildArticleNavigation = () => {

    }

    inject(document.body, `<div style="${topLayer};">
        <div style="${limited}; ${header};">
            <div style="${flexCenter};">
                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
                     style="margin-right: 1rem;"
                     width="24" height="24" stroke="#fff" stroke-width="120" fill="none">
                    <defs>
                        <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:lightskyblue;stop-opacity:1"/>
                            <stop offset="100%" style="stop-color:lightpink;stop-opacity:1"/>
                        </linearGradient>
                    </defs>
                    <path stroke="url('#rainbow')"
                          d="M938 473.9L692 332 550.1 86c-16.9-29.4-59.3-29.4-76.3 0L332 332 86 473.9c-29.4 16.9-29.4 59.3 0 76.3L332 692l141.8 246c16.9 29.4 59.3 29.4 76.3 0L692 692l246-141.8c29.3-17 29.3-59.4 0-76.3z"></path>
                </svg>
                <div style="background: linear-gradient(to right, lightskyblue, lightpink); ${fontMask}; ${logoFont};">
                    Stars Picking
                </div>
            </div>
            <div style="${flexCenter};">
                <a id="goHome" style="cursor: pointer;">${icons.iconOf('home', {width: 24, height: 24, fill: '#fff'})}</a>
            </div>
        </div>
        
        <div style="width: 100%; min-height: calc(100vh - 8rem);">
            <div style="width: 100%; min-height: calc(100vh - 8rem - 10rem);">
                <div style="${limited};">
                    <div style="${flexCenter}; flex-direction: column; width: 100%; height: 16rem;">
                        <h1 style="${normalTitle}; margin-bottom: 2.5rem;">History Articles</h1>
                        <input style="${searchFrame}; max-width: 680px;" placeholder="关键词搜索 ..."/>
                    </div>
                </div>
                
                
                <div style="${limited}; max-width: 960px;">
     
                    
                    ${articles.map(article => buildArticleDom(article)).join('')}
                
                
                </div>
            </div>
            
            <div style="${limited}; ${flexCenter}; height: 10rem;">
                <div style="${pageNo}; ${flexCenter};"><span>1</span></div>
                <div style="${pageNo}; ${flexCenter};"><span>2</span></div>
                <div style="${pageNo}; ${flexCenter};"><span>3</span></div>
                <div style="${pageNo}; ${flexCenter};"><span>4</span></div>
                <div style="${pageNo}; ${flexCenter};"><span>5</span></div>
            </div>
        </div>
        
        
        <div style="${limited}; height: 4rem; display: flex; justify-content: space-between; align-items: center;">
            <span style="${stdFont};">© Jun.Dai</span>
        </div>
    </div>`)
    document.getElementById('goHome').addEventListener('click', () => {
        navigateTo('/')
    })
}