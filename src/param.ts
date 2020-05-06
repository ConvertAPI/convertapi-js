export interface FileValue {
    Id: string
}

export interface ParamDto {
    Name: string
    Value: string
    FileValue: FileValue
    FileValues: FileValue[]
}

interface ConvertDto {
    Parameters: ParamDto[]
}

export interface IParam {
    dto(): Promise<ParamDto>
}

export default class Param implements IParam{
    constructor(
        public readonly name: string,
        public readonly value: string,
    ) {}

    public dto(): Promise<ParamDto> {
        return Promise.resolve(<ParamDto> {
            Name: this.name,
            Value: this.value
        })
    }
}