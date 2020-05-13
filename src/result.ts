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
        /**
         * Conversion result class. Can be used to get information about converted file(s) as well as passing result to other chained conversion `Parameters`.
         * 
         * @param dto
         */
        constructor(
            private readonly dto: IResultDto
        ) {}

        /**
         * Returns conversion duration seconds
         */
        public get duration(): number {
            return this.dto.ConversionTime
        }

        /**
         * Returns conversion result files. 
         */
        public get files(): IResultFileDto[] {
            return this.dto.Files
        }

        /**
         * Returns file parameter value. Value can be used to add file parameter to the chained conversion `Parameters` object.
         * ```ts
         * params.add('file', result.toParamFile())
         * ```
         * @param idx - If conversion result contains more than one file, then provided file index will be used.
         */
        public toParamFile(idx: number=0): FileValue {
            return new FileValue(this.dto.Files[idx].FileName, this.dto.Files[idx].FileId)
        }

        /**
         * Returns multiple files parameter value. Value can be used to add files parameter to the chained conversion `Parameters` object.
         * ```ts
         * params.add('files', result.toParamFiles())
         * ```
         * Can only be used with the conversions that accept multiple input files, such as `pdf` -> 'merge' conversion.
         */
        public toParamFiles(): FilesValue {
            return new FilesValue(this.dto.Files)
        }
    }
}