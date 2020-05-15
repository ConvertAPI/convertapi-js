# ConvertAPI JavaScript Client
## Convert your files with our online file conversion API

The ConvertAPI helps converting various file formats.
Creating PDF and Images from various sources like Word, Excel, Powerpoint, images, web pages.
Merge, Encrypt, Split, Repair and Decrypt PDF files.
And many others files manipulations.
In just few minutes you can integrate it into your application and use it easily.

The ConvertAPI-JS library makes it easier to use the Convert API from your web projects without having to build your own API calls.
You can get your free API secret at https://www.convertapi.com/a

## Installation

Run this line from console:

```sh
npm i convertapi-js
```

## Usage

### Configuration

You can get your secret at https://www.convertapi.com/a

```js
let convertApi = ConvertApi.auth({secret: '<YOUR_SECRET>'})
```

### File conversion

Example to convert DOCX file to PDF. All supported formats and options can be found 
[here](https://www.convertapi.com/conversions).

```js
let params = convertApi.createParams()
params.add('file', elFileInput.files[0])
let result = await convertApi.convert('docx', 'pdf', params)

// Get result file URL
let url = result.files[0].Url
```

#### Convert remote file

```js
let params = convertApi.createParams()
params.add('file', new URL('https://cdn.convertapi.com/test-files/presentation.pptx'))
let result = await convertApi.convert('pptx', 'pdf', params)

// Get result file URL
let url = result.files[0].Url
```

#### Additional conversion parameters

ConvertAPI accepts extra conversion parameters depending on converted formats. All conversion 
parameters and explanations can be found [here](https://www.convertapi.com).

```js
// Converting PDF to JPG file
let params = convertApi.createParams()
params.add('file', e.currentTarget.files[0])
params.add('ScaleImage', 'true')
params.add('ScaleProportions', 'true')
params.add('ImageHeight', '300')
params.add('ImageWidth', '300')
let result = await convertApi.convert('pdf', 'jpg', params)

// Get result file URL
let url = result.files[0].Url
```

### More examples

You can find more advanced examples in the [examples](https://github.com/ConvertAPI/convertapi-js/tree/master/examples) folder.

#### Converting your first file, full example:

ConvertAPI is designed to make converting file super easy, the following snippet shows how easy it is to get started. Let's convert WORD DOCX file to PDF:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Conversion Example</title>
    <script src="https://unpkg.com/convertapi-js/lib/convertapi.js"></script>
</head>
<body>
    <h1>ConvertAPI JavaScript library example</h1>
    <h2>Conversion Example</h2>
    <p>
        <label for="fileInput">Select DOCX file to convert it to PDF</label>
        <input id="fileInput" type="file" accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document">
    </p>
    <p id="result">
        Result file:
        <a id="resultLink" href=""></a>
    </p>
    <script src="index.js"></script>
</body>
</html>
```

```js
let convertApi = ConvertApi.auth({secret: '<YOUR_SECRET>'})
let elResult = document.getElementById('result')
let elResultLink = document.getElementById('resultLink')
elResult.style.display = 'none'

// On file input change, start conversion
document.getElementById('fileInput').addEventListener('change', async e => {
    elResult.style.display = 'none'
    document.documentElement.style.cursor = 'wait'
    try {

        // Converting DOCX to PDF file
        let params = convertApi.createParams()
        params.add('file', e.currentTarget.files[0])
        let result = await convertApi.convert('docx', 'pdf', params)

        // Showing link with the result file
        elResultLink.setAttribute('href', result.files[0].Url)
        elResultLink.innerText = result.files[0].Url
        elResult.style.display = 'block'

    } finally {
        document.documentElement.style.cursor = 'default'
    }
})
```


This is the bare-minimum to convert a file using the ConvertAPI client, but you can do a great deal more with the ConvertAPI JS library.
Take special note that you should replace `<YOUR_SECRET>` with the secret you obtained in item two of the pre-requisites.

### Issues &amp; Comments
Please leave all comments, bugs, requests, and issues on the Issues page.
We'll respond to your request ASAP!

### License
The ConvertAPI JS Library is licensed under the [MIT](http://www.opensource.org/licenses/mit-license.php "Read more about the MIT license form") license.
Refere to the [LICENSE](https://github.com/ConvertAPI/convertapi-js/blob/master/LICENSE) file for more information.