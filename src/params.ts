namespace ConvertApi {
    export class Params {
        private readonly params: IParam[] = []

        constructor(
            private readonly host: string
        ) {}

        public add(name: string, value: string | File | FileValue | URL | FileList | FilesValue): IParam {
            let param: IParam
            if (value instanceof FilesValue || value instanceof FileList) {
                param = new FilesParam(name, value, this.host)
            } else if (value instanceof FileValue || value instanceof File || value instanceof URL) {
                param = new FileParam(name, value, this.host)
            } else {
                param = new Param(name, value)
            }

            this.params.push(param)
            return param
        }

        public get(name: string): IParam | undefined {
            return this.params.find(p => p.name === name)
        }

        public delete(name: string): IParam | undefined {
            let idx = this.params.findIndex(p => p.name === name)
            return this.params.splice(idx, 1)[0]
        }

        public get dto(): Promise<IConvertDto> {
            let dtoPros = this.params.map(p => p.dto)
            return Promise.all(dtoPros).then(ds => <IConvertDto>{Parameters: ds})
        }
    }
}