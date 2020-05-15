// ConvertAPI JavaScript library example
// Example demonstrates how to convert file using ConvertAPI JavaScript library

let convertApi = ConvertApi.auth({secret: '<YOUR_SECRET>'})
let elResult = document.getElementById('result')
let elResultLink = document.getElementById('resultLink')
elResult.style.display = 'none'

// On file input change, start conversion
document.getElementById('fileInput').addEventListener('change', async e => {
    elResult.style.display = 'none'
    document.documentElement.style.cursor = 'wait'
    try {

        // Converting PDF to JPG file
        let params = convertApi.createParams()
        params.add('file', e.currentTarget.files[0])
        params.add('ScaleImage', 'true')
        params.add('ScaleProportions', 'true')
        params.add('ImageHeight', '300')
        params.add('ImageWidth', '300')
        let result = await convertApi.convert('pdf', 'jpg', params)

        // Showing link with the result file
        elResultLink.setAttribute('href', result.files[0].Url)
        elResultLink.innerText = result.files[0].Url
        elResult.style.display = 'block'

    } finally {
        document.documentElement.style.cursor = 'default'
    }
})