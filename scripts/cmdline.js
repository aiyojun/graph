// How stupid! Unexpectedly, Nodejs don't have
// cross-platform commandline/script manage tools?
// Or didn't I see it?
const process = require('process')
const child_process = require("child_process");
const cmd = process.argv[2]
const args = process.argv.slice(3).join(' ')
const platform = process.platform
const handles = {
    'rm': {
        linux: `rm -rf ${args}`,
        win32: `rmdir /Q /S ${args.replaceAll('/', '\\')}`,
    }
}
if (cmd in handles) child_process.exec(handles[cmd][platform])