var ConvertApi;

function handleRequest(request) {
    return request.json().then(files => {
// WRITE YOUR CODE FROM HERE /////////////////////////////////////////




        let convertApi = ConvertApi.auth({secret: '<YOUR_SECRET>'})

        let toPdfPro = files.map(f => {
            let params = convertApi.createParams()
            params.add('file', new ConvertApi.FileValue(f.name, f.id))
            return convertApi.convert('docx', 'pdf', params)
        })

        return Promise.all(toPdfPro).then(res => {
            let ids = res.map(r => r.toParamFile().fileId)
            let params = convertApi.createParams()
            params.add('files', ids)
            return convertApi.convert('pdf', 'merge', params)
                .then(r => new Response(JSON.stringify(r.files)))
        })






// WRITE YOUR CODE UNTIL HERE /////////////////////////////////////////
    })
}

addEventListener('fetch', event => {
    let finalResp
    try {
        let response = event.request.method === 'OPTIONS'
            ? handleOptions(event.request)
            : handleRequest(event.request)

        finalResp = Promise.resolve(response).then(r => {
            // Add CORS header
            let headers = new Headers(r.headers)
            headers.set('Access-Control-Allow-Origin', event.request.headers.get('Origin') || '*')
            headers.set('Access-Control-Allow-Headers', 'Content-Type, Content-Disposition, Cache-Control, Range, Content-Range, Content-Encoding')
            return new Response(r.body, { status: r.status, headers: headers })
        })

    } catch (e) {
        finalResp = new Response(JSON.stringify(e, Object.getOwnPropertyNames(e)), { status: 500, headers: {'content-type': 'application/json;charset=UTF-8', 'Access-Control-Allow-Origin': event.request.headers.get('Origin') || '*'}})
    }

    event.respondWith(finalResp)
});

function handleOptions(request) {
    return new Response(null, {
        headers: {
            'Allow': 'GET, HEAD, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Content-Disposition, Cache-Control, Range, Content-Range, Content-Encoding',
            'Access-Control-Max-Age': 86400,
            'Content-Length': 0
        }
    })
}

class FileList {}
class File {}

// CONVERTAPI-JS /////////////////////////////////////////////////////

"use strict";
var ConvertApi;
(function (ConvertApi_1) {
    function auth(credentials, host) {
        return new ConvertApi(credentials, host);
    }
    ConvertApi_1.auth = auth;
    class ConvertApi {
        constructor(credentials, host = 'v2.convertapi.com') {
            this.credentials = credentials;
            this.host = host;
        }
        createParams() {
            return new ConvertApi_1.Params(this.host);
        }
        convert(fromFormat, toFormat, params, converter) {
            return Promise.resolve(params.dto)
                .then(dto => {
                    let auth = this.credentials.secret ? `secret=${this.credentials.secret}` : `apikey=${this.credentials.apiKey}&token=${this.credentials.token}`;
                    let converterPath = converter ? `/converter/${converter}` : '';
                    console.log(dto)
                    return fetch(`https://${this.host}/convert/${fromFormat}/to/${toFormat}${converterPath}?${auth}&storefile=true`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(dto) })
                        .then(resp => resp.json())
                        .then(dto => new ConvertApi_1.Result(dto));
                });
        }
    }
})(ConvertApi || (ConvertApi = {}));
var ConvertApi;
(function (ConvertApi) {
    class FileValue {
        constructor(name, fileId) {
            this.name = name;
            this.fileId = fileId;
        }
    }
    ConvertApi.FileValue = FileValue;
    class FileParam {
        constructor(name, file, host) {
            this.name = name;
            this.file = file;
            this.host = host;
        }
        value() {
            if (this.file instanceof FileValue) {
                return Promise.resolve(this.file.fileId);
            }
            else {
                let uploadUrl = `https://${this.host}/upload?`;
                let response = this.file instanceof URL
                    ? fetch(`${uploadUrl}url=${this.file.href}`, { method: 'POST' })
                    : fetch(`${uploadUrl}filename=${this.file.name}`, { method: 'POST', body: this.file });
                return response.then(r => r.json()).then(obj => obj.FileId);
            }
        }
        get dto() {
            return this.value().then(v => ({
                Name: this.name,
                FileValue: { Id: v }
            }));
        }
    }
    ConvertApi.FileParam = FileParam;
})(ConvertApi || (ConvertApi = {}));
var ConvertApi;
(function (ConvertApi) {
    class FilesValue {
        constructor(files) {
            this.files = files;
        }
        asArray() {
            return this.files.map(f => new ConvertApi.FileValue(f.FileName, f.FileId));
        }
    }
    ConvertApi.FilesValue = FilesValue;
    class FilesParam {
        constructor(name, files, host) {
            this.name = name;
            this.fileValPros = [];
            if (files instanceof FileList) {
                this.fileValPros = Array.from(files).map(f => new ConvertApi.FileParam(name, f, host).value().then(i => ({
                    Id: i
                })));
            }
            else if (files instanceof FilesValue) {
                this.fileValPros = files.asArray().map(f => Promise.resolve({
                    Id: f.fileId
                }));
            }
            else {
                this.fileValPros = files.map(f => Promise.resolve(f instanceof URL ? { Url: f.href } : { Id: f }));
            }
        }
        get dto() {
            return Promise.all(this.fileValPros).then(fv => ({
                Name: this.name,
                FileValues: fv
            }));
        }
    }
    ConvertApi.FilesParam = FilesParam;
})(ConvertApi || (ConvertApi = {}));
var ConvertApi;
(function (ConvertApi) {
    class Param {
        constructor(name, value) {
            this.name = name;
            this.value = value;
        }
        get dto() {
            return Promise.resolve({
                Name: this.name,
                Value: this.value
            });
        }
    }
    ConvertApi.Param = Param;
})(ConvertApi || (ConvertApi = {}));
var ConvertApi;
(function (ConvertApi) {
    class Params {
        constructor(host) {
            this.host = host;
            this.params = [];
        }
        add(name, value) {
            let param;
            if (value instanceof ConvertApi.FilesValue || value instanceof FileList || value instanceof Array) {
                param = new ConvertApi.FilesParam(name, value, this.host);
            }
            else if (value instanceof ConvertApi.FileValue || value instanceof File || value instanceof URL) {
                param = new ConvertApi.FileParam(name, value, this.host);
            }
            else {
                param = new ConvertApi.Param(name, value);
            }
            this.params.push(param);
            return param;
        }
        get(name) {
            return this.params.find(p => p.name === name);
        }
        delete(name) {
            let idx = this.params.findIndex(p => p.name === name);
            return this.params.splice(idx, 1)[0];
        }
        get dto() {
            let dtoPros = this.params.map(p => p.dto);
            return Promise.all(dtoPros).then(ds => ({ Parameters: ds }));
        }
    }
    ConvertApi.Params = Params;
})(ConvertApi || (ConvertApi = {}));
var ConvertApi;
(function (ConvertApi) {
    class Result {
        constructor(dto) {
            this.dto = dto;
        }
        get duration() {
            return this.dto.ConversionTime;
        }
        get files() {
            return this.dto.Files;
        }
        toParamFile(idx = 0) {
            return new ConvertApi.FileValue(this.dto.Files[idx].FileName, this.dto.Files[idx].FileId);
        }
        toParamFiles() {
            return new ConvertApi.FilesValue(this.dto.Files);
        }
        uploadToS3(region, bucket, accessKeyId, secretAccessKey) {
            return this.dto.Files.map(f => {
                let dto = {
                    region: region,
                    bucket: bucket,
                    accessKeyId: accessKeyId,
                    secretAccessKey: secretAccessKey,
                    fileId: f.FileId
                };
                return fetch(`https://integration.convertapi.com/s3/upload`, {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify(dto)
                });
            });
        }
    }
    ConvertApi.Result = Result;
})(ConvertApi || (ConvertApi = {}));
var ConvertApi;
(function (ConvertApi) {
    function run(worker, files, params) {
        if (files instanceof File)
            files = [files];
        let uploadsPro = Array.from(files).map(f => fetch('https://v2.convertapi.com/upload', { method: 'POST', body: f }))
            .map(respPro => respPro.then(resp => resp.json())
                .then(obj => ({
                    name: obj.FileName,
                    ext: obj.FileExt,
                    size: obj.FileSize,
                    id: obj.FileId,
                    url: `https://v2.convertapi.com/d/${obj.FileId}`
                })));
        params === null || params === void 0 ? void 0 : params.forEach((k, v) => worker.searchParams.append(k, v));
        return Promise.all(uploadsPro).then(fls => fetch(worker.href, {
            method: 'POST',
            headers: { 'content-type': 'application/json;charset=UTF-8' },
            body: JSON.stringify(fls)
        }));
    }
    ConvertApi.run = run;
})(ConvertApi || (ConvertApi = {}));