import axios from "axios";

export type Article = {uuid?: string, author: string, title: string, filename: string, abstract: string, create_time: string}
export const readGuideJson = async () => await axios.get('/articles/post.json').then(resp => resp.data.articles).catch(_ => [])


export const getRecentArticles = async () => {
    const articles = await readGuideJson() as Array<Article>
    articles.sort((x, y) => Date.parse(x.create_time) - Date.parse(y.create_time))
    return articles.slice(0, 10)
}