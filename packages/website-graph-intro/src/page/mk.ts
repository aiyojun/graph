import showdown from "showdown/dist/showdown.js"
import "@/fonts/fonts-support.css"
import axios from "axios";
import highlight from "highlight.js"
import "highlight.js/styles/default.css"
import {declareResponsiveWebsite, inject, locate, UR} from "@/jlib";
import "@/page/star.css"
import "@/css/foundation.min.css"

export const PageOfArticle = async (url: string) => {
    const ur = UR.parse(url)
    const queryMap = ur.parameters // new Map()
    const article = await axios
        .get(`/articles/${queryMap.get('article') || 'not-found.md'}`)
        .then(resp => resp.data).catch(_ => `# Error\nWe cannot find related article for you!`)
    declareResponsiveWebsite()
    const converter = new showdown.Converter({backslashEscapesHTMLTags: true,
        completeHTMLDocument: true,
        disableForced4SpacesIndentedSublists: true,
        ellipsis: true,
        emoji: true,
        encodeEmails: true,
        excludeTrailingPunctuationFromURLs: true,
        ghCodeBlocks: true,
        ghCompatibleHeaderId: true,
        ghMentions: true,
        headerLevelStart: true,
        literalMidWordAsterisks: true,
        literalMidWordUnderscores: true,
        metadata: true,
        noHeaderId: true,
        omitExtraWLInCodeBlocks: true,
        openLinksInNewWindow: true,
        parseImgDimensions: true,
        prefixHeaderId: true,
        rawHeaderId: true,
        rawPrefixHeaderId: true,
        requireSpaceBeforeHeadingText: true,
        simpleLineBreaks: true,
        simplifiedAutoLink: true,
        smartIndentationFix: true,
        smoothLivePreview: true,
        splitAdjacentBlockquotes: true,
        strikethrough: true,
        tables: true,
        tablesHeaderId: true,
        tasklists: true,
        underline: true,})
    const page = inject(document.body, `<div style="position: absolute; top: 0; left: 0; width: 100%; display: flex; flex-direction: column;">
        <div style="width: 100%; height: 4rem;">
            <div class="limited" style="width: 100%; box-sizing: border-box; padding: 0 0.75rem; border-bottom: 1px solid var(--border-color); height: 4rem; display: flex; justify-content: space-between; align-items: center; color: #555;">
                <div style="display: flex; align-items: center;">
                    <div class="image-mask" style="margin-right: 1rem;"></div>
                    <label class="pretty-rainbow-font" style="cursor: default; font-size: 1.25rem; font-weight: bold; font-family: 'Maven Pro', Roboto, sans-serif;">Stars Picking</label>
                </div>
                <div>
                    <a href="https://www.github.com/aiyojun"><img alt="" src="/github.svg"/></a>
                </div>
            </div>
        </div>
        <div class="limited" style="width: 100%; box-sizing: border-box; padding: 0 0.75rem; min-height: calc(100vh - 7rem); display: flex;">
            <div class="article"></div>
        </div>
        <div class="limited" style="width: 100%; height: 3rem; line-height: 3rem; text-align: center; color: #888; font-size: .75rem; border-top: 1px solid var(--border-color);">Copyright © 2023, All rights reserved.</div>
    </div>`)
    const markdown = locate(page, '//div[@class="article"]')
    inject(markdown, converter.makeHtml(article))
    markdown.querySelectorAll('pre code').forEach(el => highlight.highlightBlock(el))
}