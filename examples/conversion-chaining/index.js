// ConvertAPI JavaScript library example
// Example demonstrates how to chain conversions using ConvertAPI JavaScript library

let convertApi = ConvertApi.auth({secret: '<YOUR_SECRET>'})
let elResult = document.getElementById('result')
let elResultLink = document.getElementById('resultLink')
elResult.style.display = 'none'

// On file input change, start conversion
document.getElementById('fileImput').addEventListener('change', async e => {
    elResult.style.display = 'none'
    document.documentElement.style.cursor = 'wait'
    try {

        // Splitting PDF file
        let splitParams = convertApi.createParams()
        splitParams.add('file', e.currentTarget.files[0])
        let splitResult = await convertApi.convert('pdf', 'split', splitParams)

        // Zipping PDF files
        let zipParams = convertApi.createParams()
        zipParams.add('files', splitResult.toParamFiles())
        let zipResult = await convertApi.convert('pdf', 'zip', zipParams)

        // Showing link with the result file
        elResultLink.setAttribute('href', zipResult.files[0].Url)
        elResultLink.innerText = zipResult.files[0].Url
        elResult.style.display = 'block'

    } finally {
        document.documentElement.style.cursor = 'default'
    }
})