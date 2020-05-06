import {FileValue, IParam, ParamDto} from "./param";
import FileParam from "./file-param";

export default class FilesParam implements IParam {
    private files: FileValue[] = []

    constructor(
        private readonly name: string,
        private readonly files: string[] | FileList,
        private readonly host: string
    ) {
        if (files instanceof FileList) {
            this.files = Array.from(files).map(f => new FileParam(name, f, host))
        } else {
            this.files = files.map(f => new Param(name, f))
        }
    }

    public get dto(): Promise<ParamDto> | undefined{
        let fileValPro = this.files.map(f => f.value)
        return Promise.all(fileValPro).then(fvs => (<ParamDto> {
            Name: this.name,
            FileValues: fvs.map(fv => <FileValue> {
                Id: fv
            })
        }))
    }
}