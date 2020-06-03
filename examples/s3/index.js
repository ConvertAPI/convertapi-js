// ConvertAPI JavaScript library example
// Example demonstrates how to convert file using ConvertAPI JavaScript library

let convertApi = ConvertApi.auth({secret: '<YOUR_SECRET>'})
let elResult = document.getElementById('result')

// On file input change, start conversion
document.getElementById('fileInput').addEventListener('change', async e => {
    document.documentElement.style.cursor = 'wait'
    elResult.innerText = ''
    try {
        // Converting DOCX to PDF file
        let params = convertApi.createParams()
        params.add('file', e.currentTarget.files[0])
        let result = await convertApi.convert('docx', 'pdf', params)

        let s3Result = await result.uploadToS3("eu-central-1", "convertapi", "AKIAJE72IIVOQZ4M7JSQ", "zVA+LcK1HgFXIY1BKuLY5f0gNq5w4PSYr/q/rdfW")[0]
        elResult.innerText = s3Result.status === 200 ? 'Result file is uploaded to AWS S3' : 'Error while uploading to AWS S3' 
    } finally {
        document.documentElement.style.cursor = 'default'
    }
})