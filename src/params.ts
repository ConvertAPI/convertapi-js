namespace ConvertApi {
    export interface IParamInit {
        name: string
        value: string | string[]
        isFile: boolean
    }

    export class Params {
        private readonly params: IParam[] = []

        /**
         * Conversion parameters class. It contains parameters that will be passed to the conversion method.
         * Files are also parameters, file upload is done automatically.
         *
         * @remarks
         * Instance of this class should be created using ConvertApi.createParams() method.
         */
        constructor(
            private readonly host: string,
            init?: IParamInit[]
        ) {
            let param: IParam
            init?.forEach(p => {
                if (p.isFile) {
                    if (typeof(p.value) === 'string') {
                        param = new FileParam(p.name, new FileValue('', p.value), this.host)
                    } else {
                        param = p.value instanceof Array
                            ? new FilesParam(p.name, p.value, this.host)
                            : param = new FileParam(p.name, p.value, this.host)
                    }
                } else {
                    param = new Param(p.name, <string>p.value)
                }
                this.params.push(param)
            })
        }

        /**
         * Adds new parameter to `Parameters` object. Files are also accepted as parameter values.
         *
         * @param name - parameter name. All conversion parameters and valid parameter values can be found at {@link https://www.convertapi.com/conversions | convertapi.com} site.
         * @param value - parameter value.
         */
        public add(name: string, value: string | string[] | File | FileValue | URL  | URL[] | FileList | FilesValue): IParam {
            let param: IParam
            if (value instanceof FilesValue || value instanceof FileList || value instanceof Array) {
                param = new FilesParam(name, value, this.host)
            } else if (value instanceof FileValue || value instanceof File || value instanceof URL) {
                param = new FileParam(name, value, this.host)
            } else {
                param = new Param(name, value)
            }

            this.params.push(param)
            return param
        }

        /**
         * Returns parameter object by the provided parameter name.
         *
         * @param name - Parameter name.
         */
        public get(name: string): IParam | undefined {
            return this.params.find(p => p.name === name)
        }

        /**
         * Removes parameter from `Parameters` object.
         *
         * @param name - Parameter name that should be removed.
         */
        public delete(name: string): IParam | undefined {
            let idx = this.params.findIndex(p => p.name === name)
            return this.params.splice(idx, 1)[0]
        }

        public get dto(): Promise<IConvertDto> {
            let dtoPros = this.params.map(p => p.dto)
            return Promise.all(dtoPros).then(ds => <IConvertDto>{Parameters: ds})
        }
    }
}