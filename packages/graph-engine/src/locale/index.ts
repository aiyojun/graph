let language = 'en'
const dictionary = { }
export const lang = (s: string) => language = s
export const load = (lang: string, dict: any) => dictionary[lang] = dict
export const $t = (word: string) =>
    (language in dictionary && word in dictionary[language])
        ? dictionary[language][word] : word
export const $T = s => {
    const word = $t(s)
    return word[0].toUpperCase() + word.substring(1)
}
