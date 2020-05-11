import Param, {IConvertDto, IParam} from "./param";
import FilesParam, {FilesValue} from "./files-param";
import FileParam, {FileValue} from "./file-param";

export default class Params {
    private readonly paramPros: Promise<IParam>[] = []

    constructor(
        private readonly host: string
    ) {}

    public add(name: string, value: string | File | FileValue | FileList | FilesValue | Promise<string | File | FileValue | FileList | FilesValue> ): Promise<IParam> {
        let paramPro = Promise.resolve(value).then(v => {
            if (v instanceof FilesValue || v instanceof FileList) {
                return new FilesParam(name, v, this.host)
            } else if (v instanceof FileValue || v instanceof File) {
                return new FileParam(name, v, this.host)
            } 
            return new Param(name, v)
        })

        this.paramPros.push(paramPro)
        return paramPro
    }
    
    public get dto(): Promise<IConvertDto> {
        return Promise.all(this.paramPros)
            .then(ps => ps.map(p => p.dto))
            .then(dsp => Promise.all(dsp))
            .then(ds => <IConvertDto>{ Parameters: ds })
    }
}