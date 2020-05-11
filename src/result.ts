import {FilesValue} from "./files-param";

export interface IResultFileDto {
    FileName: string,
    FileExt: string,
    FileSize: number,
    FileId: string,
    Url: string
}

export interface IResultDto {
    ConversionTime: number,
    Files: IResultFileDto[]
}

export default class Result {
    constructor(
        public readonly dto: IResultDto
    ) {}

    public toParamFiles(): FilesValue {
        return new FilesValue(this.dto.Files)
    }    
}