namespace ConvertApi {
    /**
     * Requests custom worker
     *
     * @param worker - Worker endpoint
     * @param files - Files that should be passed to worker
     * @param params - Custom parameter used inside worker
     * @returns - Worker response object promise
     */
    export function run(worker: URL, files: File | File[] | FileList, params?: URLSearchParams): Promise<Response> {
        if (files instanceof File) files = [files]
        let uploadsPro = Array.from(files).map(f =>
            fetch(`https://v2.convertapi.com/upload?filename=${f.name}`, { method: 'POST', body: f }))
                .map(respPro =>
                    respPro.then(resp => resp.json())
                        .then(obj => ({
                            name: obj.FileName,
                            ext: obj.FileExt,
                            size: obj.FileSize,
                            id: obj.FileId,
                            url: `https://v2.convertapi.com/d/${obj.FileId}`
                        }))
                )

        params?.forEach((k, v) => worker.searchParams.append(k, v))        
        return Promise.all(uploadsPro).then(fls =>
            fetch(worker.href, {
                method: 'POST',
                headers: {'content-type': 'application/json;charset=UTF-8'},
                body: JSON.stringify(fls)
            })
        )
    }        
}