import Param, {FileValue, ParamDto} from "./param";

interface UploadResponseDto {
    FileId: string
    FileName: string,
    FileExt: string
}

export default class FileParam extends Param {
    private readonly file: File | undefined
    private readonly host: string

    constructor(name: string, file: string | Promise<string> | File, host: string) {
        if (file instanceof File) {
            super(name)
            this.file = file
        } else {
            super(name, Promise.resolve(file))
        }
        this.host = host
    }

    public get value(): Promise<string>  | undefined {
        if (this.file instanceof File) {
            return fetch(`https://${this.host}/upload?filename=${this.file.name}`, { method: 'POST', body: this.file })
                .then(r => <Promise<UploadResponseDto>>r.json())
                .then(obj => obj.FileId)
        } else {
            return super.value
        }
    }

    public get dto(): Promise<ParamDto> | undefined{
        return this.value?.then( v => (<ParamDto> {
            Name: this.name,
            FileValue: <FileValue> {
                Id: v
            }
        }))
    }
}