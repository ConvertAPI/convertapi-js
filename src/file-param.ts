import Param, {FileValue, IParam, ParamDto} from "./param";

interface UploadResponseDto {
    FileId: string
    FileName: string,
    FileExt: string
}

export default class FileParam implements IParam {
    constructor(
        public readonly name: string,
        public readonly file: File,
        public readonly host: string
    ) {}

    public value(): Promise<string> {
        return fetch(`https://${this.host}/upload?filename=${this.file.name}`, { method: 'POST', body: this.file })
            .then(r => <Promise<UploadResponseDto>>r.json())
            .then(obj => obj.FileId)
    }

    public dto(): Promise<ParamDto> {
        return this.value().then( v => (<ParamDto> {
            Name: this.name,
            FileValue: <FileValue> {
                Id: v
            }
        }))
    }
}