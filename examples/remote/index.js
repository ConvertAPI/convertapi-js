// ConvertAPI JavaScript library example
// Example demonstrates how to convert remote file using ConvertAPI JavaScript library

let convertApi = ConvertApi.auth({secret: '<YOUR_SECRET>'})
let elResult = document.getElementById('result')
let elResultLink = document.getElementById('resultLink')
let elUrl = document.getElementById('urlInput')
elResult.style.display = 'none'

// On file input change, start conversion
document.getElementById('convertBtn').addEventListener('click', async e => {
    elResult.style.display = 'none'
    document.documentElement.style.cursor = 'wait'
    try {

        // Converting remote PPTX to PDF file
        let params = convertApi.createParams()
        params.add('file', new URL(elUrl.value))
        let result = await convertApi.convert('pptx', 'pdf', params)

        // Showing link with the result file
        elResultLink.setAttribute('href', result.files[0].Url)
        elResultLink.innerText = result.files[0].Url
        elResult.style.display = 'block'

    } finally {
        document.documentElement.style.cursor = 'default'
    }
})