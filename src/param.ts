namespace ConvertApi {
    export interface IFileValue {
        Id: string
        Url: string
    }

    export interface IParamDto {
        Name: string
        Value: string
        FileValue: IFileValue
        FileValues: IFileValue[]
    }

    export interface IConvertDto {
        Parameters: IParamDto[]
    }

    export interface IParam {
        name: string
        dto: Promise<IParamDto>
    }

    export interface IParams {
        dto: Promise<IConvertDto>
    }

    export class Param implements IParam {
        /**
         * String type conversion parameter class.
         * 
         * @param name - parameter name.
         * @param value - parameter value.
         */
        constructor(
            public readonly name: string,
            public readonly value: string,
        ) {
        }

        public get dto(): Promise<IParamDto> {
            return Promise.resolve(<IParamDto>{
                Name: this.name,
                Value: this.value
            })
        }
    }
}    