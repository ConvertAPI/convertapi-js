import Param, {ParamValue} from "./param";

export default class Params {
    private readonly params: Param[] = []

    constructor() {
    }

    public add(name: string, value: ParamValue): Param {
        let param = new Param(name, value)
        this.params.push(param)
        return param
    }

    public addFile(name: string, value: ParamValue): Param {
        let param = new Param(name, value)
        this.params.push(param)
        return param
    }
}