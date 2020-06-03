namespace ConvertApi {
    export class FilesValue {
        constructor(
            private readonly files: IResultFileDto[]
        ) {}
    
        public asArray(): FileValue[] {
            return this.files.map(f => new FileValue(f.FileName, f.FileId))
        }
    }
    
    export class FilesParam implements IParam {
        private fileValPros: Promise<IFileValue>[] = []
    
        constructor(
            public readonly name: string,
            files: string[] | URL[] | FileList | FilesValue,
            host: string
        ) {
            if (files instanceof FileList) {
                this.fileValPros = Array.from(files).map(f => new FileParam(name, f, host).value().then(i => (<IFileValue>{
                    Id: i
                })))
            } else if (files instanceof FilesValue) {
                this.fileValPros = files.asArray().map(f => Promise.resolve((<IFileValue>{
                    Id: f.fileId
                })))
            } else {
                this.fileValPros = (files as Array<string|URL>).map(f => 
                    Promise.resolve(f instanceof URL ? <IFileValue>{Url: f.href} : <IFileValue>{Id: f})
                )
            }
        }
    
        public get dto(): Promise<IParamDto> {
            return Promise.all(this.fileValPros).then(fv => <IParamDto>{
                Name: this.name,
                FileValues: fv
            })
        }
    }
}