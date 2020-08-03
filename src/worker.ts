namespace ConvertApi {
    /**
     * Requests custom worker
     *
     * @param worker - Worker endpoint
     * @param params - Object that represents parameters passed to the worker. Value can be string or file(s).
     * @returns - Worker response object promise
     */
    export function worker(worker: URL, params: any | HTMLFormElement): Promise<Response> {
        let paramPros = params instanceof HTMLFormElement
            ? Array.from(new FormData(params).entries()).map(pair => resolveParam(pair[0], pair[1]))
            : Object.keys(params).map(k => resolveParam(k, params[k]))

        return Promise.all(paramPros).then(p => fetch(worker.href, {
            method: 'POST',
            headers: {
                'content-type': 'application/json;charset=UTF-8',
                'convertapi-params': 'true'
            },
            body: JSON.stringify(p)
        }))
    }
    
    function resolveParam(name: string, value: string | File | FileList | Array<File>): Promise<IParamInit> {
        let valPro: Promise<string | string[]>
        let isFile: boolean
        if (value instanceof File) {
            valPro = upload(value)
            isFile = true
        } else if (value instanceof FileList || value instanceof Array) {
            valPro = uploadMulti(value)
            isFile = true
        } else {
            valPro = Promise.resolve(value)
        }
        
        return valPro.then(v => (<IParamInit>{
            name: name,
            value: v,
            isFile: isFile
        }))
    }
    
    function uploadMulti(value: FileList | Array<File>): Promise<string[]> {
        let dtoPros = Array.from(value).filter(f => f instanceof File).map(upload)
        return Promise.all(dtoPros)
    }

    function upload(f: File): Promise<string> {
        return fetch(`https://v2.convertapi.com/upload?filename=${f.name}`, { method: 'POST', body: f })
            .then(resp => resp.status === 200 ? <Promise<UploadResponseDto>>resp.json() : Promise.reject(`File ${f.name} upload has failed with the status code ${resp.status}`))
            .then(dto => dto.FileId)
    }
}