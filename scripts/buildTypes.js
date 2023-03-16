const path = require('path')
const fs = require('fs')
const process = require('process')

const project = process.argv[2]
fs.readFile(path.join(__dirname, `../packages/${project}/package.json`), function (err, pack) {
    if (err) return console.error(err)
    fs.writeFile(path.join(__dirname, `../packages/@types/${project}/package.json`), JSON.stringify({
        "name": `@types/${project}`,
        "version": `${pack['version'] || '1.0.0'}`,
        "description": `TypeScript definitions for ${project}`,
        "license": "MIT",
        "types": "index.d.ts"
    }, null, 2), function (err) {
        if (err) return console.error(err)
    })
})
