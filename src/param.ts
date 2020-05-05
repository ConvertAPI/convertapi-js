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

export default class Param {
    constructor(
        public readonly name: string,
        private readonly _value?: string | Promise<string>,
    ) {}

    public get value(): Promise<string> | undefined {
        if (typeof this._value === 'undefined') {
            return undefined
        }
        return Promise.resolve(this._value)
    }

    public get dto(): Promise<ParamDto> | undefined {
        return this.value?.then( v => (<ParamDto> {
            Name: this.name,
            Value: v
        }))
    }
}