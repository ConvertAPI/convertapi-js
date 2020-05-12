import {IFileValue, IParam, IParamDto} from "./param.js"

interface UploadResponseDto {
    FileId: string
    FileName: string,
    FileExt: string
}

export class FileValue {
    constructor(
        public readonly name: string,
        public readonly fileId: string
    ) {}
}

export default class FileParam implements IParam {
    constructor(
        public readonly name: string,
        public readonly file: File | FileValue,
        public readonly host: string
    ) {}

    public value(): Promise<string> {
        return fetch(`https://${this.host}/upload?filename=${this.file.name}`, <RequestInit>{ method: 'POST', body: this.file })
            .then(r => <Promise<UploadResponseDto>>r.json())
            .then(obj => obj.FileId)
    }

    public get dto(): Promise<IParamDto> {
        return this.value().then( v => <IParamDto>{
            Name: this.name,
            FileValue: <IFileValue>{ Id: v }
        })
    }
}