// ConvertAPI JavaScript library example
// Example demonstrates how to convert file using ConvertAPI JavaScript library

let elResult = document.getElementById('result')
let elResultLink = document.getElementById('resultLink')
elResult.style.display = 'none'

// On file input change, start conversion
document.getElementById('fileInput').addEventListener('change', async e => {
    elResult.style.display = 'none'
    document.documentElement.style.cursor = 'wait'
    ConvertApi.worker(new URL('https://worker.convertapi.com/user/100000001/worker/docx-pdf-split-zip'), { file: e.currentTarget.files[0] })
        .then(r => r.json())
        .then(files => {
            elResultLink.innerText = files[0].FileName
            elResultLink.setAttribute('href', files[0].Url)
            elResult.style.display = 'block'
        })
        .finally(() => document.documentElement.style.cursor = 'default')
})