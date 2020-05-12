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
        private fileIdPros: Promise<string>[] = []
    
        constructor(
            public readonly name: string,
            files: FileList | FilesValue,
            host: string
        ) {
            if (files instanceof FileList) {
                this.fileIdPros = Array.from(files).map(f => new FileParam(name, f, host).value())
            } else {
                this.fileIdPros = files.asArray().map(f => Promise.resolve(f.fileId))
            }
        }
    
        public get dto(): Promise<IParamDto> {
            return Promise.all(this.fileIdPros).then(fids => <IParamDto> {
                Name: this.name,
                FileValues: fids.map(fid => <IFileValue> { Id: fid })
            })
        }
    }
}