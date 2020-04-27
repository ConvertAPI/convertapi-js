export default class Convertapi {
    host = 'v2.convertapi.com'
    apiKey
    token
    secret

    constructor(credentials) {
        this.apiKey = credentials.apiKey
        this.token = credentials.token
        this.secret = credentials.secret
    }

    param(name, value) {
        return {
            name: name,
            value: value
        }
    }

    fileParam(parameterName, file) {
        let uploadsPro = [file].flat().map(f =>
            fetch(`https://${this.host}/upload`, { method: 'POST', body: f }))
                .map(respPro => respPro.then(resp => resp.json()).then(obj => ({ id: obj.FileId }))
        )

        return Promise.all(uploadsPro).then(ids => this.newFileParameter(parameterName, ids))
    }

    convert(fromFormat, toFormat, paramsPro) {
        let auth = secret ? `secret=${this.secret}` : `apikey=${this.apiKey}&token=${this.token}`
        return Promise.resolve(paramsPro).then(function(p) {
            let body = JSON.stringify({ parameters: p })
            return fetch(`https://${this.host}/convert/${fromFormat}/to/${toFormat}?${auth}&storefile=true`, { method: 'POST', body: body })
                .json()
        })
    }

    resultParam(parameterName, resultPro) {
        return Promise.resolve(resultPro)
            .then(resObj => resObj.Files.map(f => ({ id: f.FileId })) )
            .then(ids => this.newFileParameter(parameterName, ids))
    }

    newFileParameter(parameterName, valObjs) {
        let parameter = { name: parameterName }
        let valObjsArr = valObjs.flat()
        if (valObjsArr.length > 1) {
            parameter['fileValues'] = valObjsArr
        } else {
            parameter['fileValue'] = valObjsArr[0]
        }
        return parameter
    }
}