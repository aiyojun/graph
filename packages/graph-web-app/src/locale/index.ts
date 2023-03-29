let language = 'en'
const dictionary = { }
const lang = (s: string) => language = s
const load = (lang: string, dict: any) => dictionary[lang] = dict
const $t = (word: string) =>
    (language in dictionary && word in dictionary[language])
        ? dictionary[language][word] : word
const $T = s => {
    const word = $t(s)
    return word[0].toUpperCase() + word.substring(1)
}

export default {
    lang, load, $t, $T
}