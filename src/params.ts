import Param from "./param";

export default class Params {
    private readonly params: Param[] = []

    constructor(
        private readonly host: string
    ) {}

    public add(name: string, value: string | File | FileList | string[] | Promise<string | File | FileList | string[]> ): Param {
        Promise.resolve(value).then(v => {

        })

        let param = new Param(name, value)
        this.params.push(param)
        return param
    }
}