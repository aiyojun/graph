import {inject} from "@/utils/jlib";
import icons from "@/utils/icons"
import axios from "axios";
import "./model.css"


const maskOverlay = () => {
    return inject(document.body, `<div 
        style="position: absolute; left: 0; top: 0; width: 100vw; height: 100vh; background-color: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center;">
    </div>`)
}



export const PageModel = async (el: Element) => {

    const models = await axios.get('/star-service/model/history').then(resp => resp.data.models).catch(_ => [])

    const card = (group: string, name: string, desc: string, author: string) => {
        return (`<div class="responsive-col-sm-12 responsive-col-3" style="box-sizing: border-box; padding: .5rem;">
                <div class="card-hover" style="font-family: alliance, 'Microsoft YaHei UI Light', 'Microsoft YaHei', sans-serif;
                box-sizing: border-box; padding: .25rem 1rem; border-radius: .5rem; height: 10rem; 
                box-shadow: 0 0 10px 5px rgba(255,255,255,0.05); cursor: pointer; 
                display: flex; flex-direction: column; justify-content: space-around;">
                    <div style="width: 100%;">${group}</div>
                    <div style="width: 100%; text-align: center; font-size: .75rem; color: #aaa;">${name}</div>
                    <div style="width: 100%; text-align: center; font-size: .75rem; color: #aaa;">${desc}</div>
                    <div style="width: 100%; font-size: .75rem; display: flex; justify-content: flex-end; align-items: center;">
                        <div style="width: 12px; height: 12px; margin-right: .5rem;">${icons.iconOf('user', {width: 12, height: 12, fill: '#fff'})}</div>
                        <div>${author}</div>
                    </div>
                </div>
            </div>`)
    }

    inject(el, `<div style="position: absolute; left: 0; top: 0; width: 100%; display: flex; flex-direction: column;">
        <div style="width: 100%; display: flex; flex-wrap: wrap;">
            <div class="responsive-col-sm-12 responsive-col-3" style="box-sizing: border-box; padding: .5rem;">
                <div id="createModel" class="card-hover" style="width: 100%; box-sizing: border-box; padding: .25rem 1rem; border-radius: .5rem; height: 10rem; 
                box-shadow: 0 0 10px 5px rgba(255,255,255,0.05); cursor: pointer;
                display: flex; justify-content: center; align-items: center;">
                    ${icons.iconOf('plus', {width: 32, height: 32, fill: '#fff'})}
                </div>
            </div>
            ${models.map(model => card(
                model['group'] || 'Unknown', model['name'] || 'Unknown', model['description'] || 'Unknown', model['author'] || 'Unknown')).join('')}
        </div>
    </div>`)

    const newButton = document.getElementById('createModel')
    newButton.addEventListener('click', () => {
        const mask = maskOverlay()
        const form = inject(mask, `<div style="position: relative; width: 100%; margin-left: auto; margin-right: auto; max-width: 960px; 
                display: flex; flex-direction: column; align-items: center; background-color: #333; padding: 3rem; box-shadow: 0 0 15px 5px rgba(255,255,255,.05);
                 font-family: alliance, 'Microsoft YaHei UI Light', 'Microsoft YaHei', sans-serif;">
            <div id="closeCreateModelForm" style="position: absolute; top: .5rem; right: .5rem; cursor: pointer;">
                ${icons.iconOf('close', {width: 24, height: 24, fill: '#fff'})}
            </div>
            <div style="width: 100%; text-align: center; font-size: 1.5rem; font-weight: bold;">
                <div>Create Model</div>
            </div>
            <div style="display: flex; align-items: center; font-size: 1.25rem; margin-top: 2rem;">
                <div style="min-width: 10rem; text-align: right;"><label style="margin-right: 1rem;">Type</label></div>
                <div style="flex-shrink: 0;"><input id="model-type" class="dark-form-input" placeholder="Algorithm"/></div>
            </div>
            <div style="display: flex; align-items: center; font-size: 1.25rem; margin-top: 2rem;">
                <div style="min-width: 10rem; text-align: right;"><label style="margin-right: 1rem;">Name</label></div>
                <div style="flex-shrink: 0;"><input id="model-name" class="dark-form-input" placeholder=""/></div>
            </div>
            <div style="display: flex; align-items: center; font-size: 1.25rem; margin-top: 2rem;">
                <div style="min-width: 10rem; text-align: right;"><label style="margin-right: 1rem;">Description</label></div>
                <div style="flex-shrink: 0;"><input id="model-desc" class="dark-form-input" placeholder=""/></div>
            </div>
            <div style="display: flex; align-items: center; font-size: 1.25rem; margin-top: 2rem;">
                <div style="min-width: 10rem; text-align: right;"><label style="margin-right: 1rem;">Author</label></div>
                <div style="flex-shrink: 0;"><input id="model-author" class="dark-form-input" placeholder=""/></div>
            </div>
            <div style="width: 100%; display: flex; justify-content: center; font-size: 1.25rem; margin-top: 2rem;">
                <div id="submitModelCreation" class="dark-form-submit">Submit</div>
            </div>
        </div>`)
        mask.addEventListener('click', () => mask.remove())
        form.addEventListener('click', e => e.stopPropagation())
        const formCloseButton = document.getElementById('closeCreateModelForm')
        formCloseButton.addEventListener('click', () => mask.remove())
        const formSubmitButton = document.getElementById('submitModelCreation')
        const modelGroup   = (document.getElementById('model-type') as HTMLInputElement)
        const modelName    = (document.getElementById('model-name') as HTMLInputElement)
        const modelDesc    = (document.getElementById('model-desc') as HTMLInputElement)
        const modelAuthor  = (document.getElementById('model-author') as HTMLInputElement)
        formSubmitButton.addEventListener('click', () => {
            const fi = {
                group : modelGroup.value,
                name  : modelName.value,
                description : modelDesc.value,
                author: modelAuthor.value,
            }
            let passed = true
            if (fi.group  === '') { modelGroup.style.borderBottom  = '1px solid red'; passed = false }
            if (fi.name   === '') { modelName.style.borderBottom   = '1px solid red'; passed = false }
            if (fi.description === '') { modelDesc.style.borderBottom   = '1px solid red'; passed = false }
            if (fi.author === '') { modelAuthor.style.borderBottom = '1px solid red'; passed = false }
            if (!passed) return
            axios.post('/star-service/model/create', fi).then(resp => {
                mask.remove()
            }).catch(err => {

            })
        })
    })
}