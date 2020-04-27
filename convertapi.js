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
            Name: name,
            Value: value
        }
    }

    fileParam(parameterName, files) {
        if (files instanceof FileList) files = Array.from(files)
        let uploadsPro = [files].flat().map(f =>
            fetch(`https://${this.host}/upload?filename=${f.name}`, { method: 'POST', body: f }))
                .map(respPro => respPro.then(resp => resp.json()).then(obj => ({ Id: obj.FileId }))
        )

        return Promise.all(uploadsPro).then(ids => this.newFileParameter(parameterName, ids))
    }

    convert(fromFormat, toFormat, paramsPro) {
        // Parameters can be promises that must be resolved
        return Promise.resolve(paramsPro)
            .then(params => params.map(p => Promise.resolve(p)))
            .then(pp => Promise.all(pp))
            .then(p => {
                let auth = this.secret ? `secret=${this.secret}` : `apikey=${this.apiKey}&token=${this.token}`
                let body = JSON.stringify({ Parameters: p })
                return fetch(`https://${this.host}/convert/${fromFormat}/to/${toFormat}?${auth}&storefile=true`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: body })
                    .then(resp => resp.json())
            })
    }

    resultParam(parameterName, resultPro) {
        return Promise.resolve(resultPro)
            .then(resObj => resObj.Files.map(f => ({ id: f.FileId })) )
            .then(ids => this.newFileParameter(parameterName, ids))
    }

    newFileParameter(parameterName, valObjs) {
        let parameter = { Name: parameterName }
        let valObjsArr = valObjs.flat()
        if (valObjsArr.length > 1) {
            parameter['FileValues'] = valObjsArr
        } else {
            parameter['FileValue'] = valObjsArr[0]
        }
        return parameter
    }
}