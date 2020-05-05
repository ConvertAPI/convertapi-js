interface Credentials {
    secret: string
    apiKey:  string
    token: string
}

export default class ConvertApi {
    constructor(
        public readonly credentials: Credentials,
        public readonly host: string='v2.convertapi.com'
    ) {}

    param(name, value) {
        return {
            Name: name,
            Value: value
        }
    }

    fileParam(parameterName, files) {
        if (files instanceof FileList) files = Array.from(files)
        let uploadsPro = [files].flat().map(f =>
            fetch(`https://${this._host}/upload?filename=${f.name}`, { method: 'POST', body: f }))
                .map(respPro => respPro.then(resp => resp.json()).then(obj => ({ Id: obj.FileId }))
        )

        return Promise.all(uploadsPro).then(ids => this._newFileParameter(parameterName, ids))
    }

    convert(fromFormat, toFormat, paramsPro) {
        // Parameters can be promises that must be resolved
        return Promise.resolve(paramsPro)
            .then(params => params.map(p => Promise.resolve(p)))
            .then(pp => Promise.all(pp))
            .then(p => {
                let auth = this._credentials.secret ? `secret=${this._credentials.secret}` : `apikey=${this._credentials.apiKey}&token=${this._credentials.token}`
                let body = JSON.stringify({ Parameters: p })
                return fetch(`https://${this._host}/convert/${fromFormat}/to/${toFormat}?${auth}&storefile=true`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: body })
                    .then(resp => resp.json())
            })
    }

    resultParam(parameterName, resultPro) {
        return Promise.resolve(resultPro)
            .then(resObj => resObj.Files.map(f => ({ id: f.FileId })) )
            .then(ids => this._newFileParameter(parameterName, ids))
    }

    _newFileParameter(parameterName, valObjs) {
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