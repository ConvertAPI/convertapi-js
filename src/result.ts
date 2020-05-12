namespace ConvertApi {
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

    export class Result {
        constructor(
            private readonly dto: IResultDto
        ) {}

        public get duration(): number {
            return this.dto.ConversionTime
        }

        public get files(): IResultFileDto[] {
            return this.dto.Files
        }

        public toParamFile(): FileValue {
            return new FileValue(this.dto.Files[0].FileName, this.dto.Files[0].FileId)
        }

        public toParamFiles(): FilesValue {
            return new FilesValue(this.dto.Files)
        }
    }
}