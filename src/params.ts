namespace ConvertApi {
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
            private readonly host: string
        ) {}

        /**
         * Adds new parameter to `Parameters` object. Files are also accepted as parameter values.
         *
         * @param name - parameter name. All conversion parameters and valid parameter values can be found at {@link https://www.convertapi.com/conversions | convertapi.com} site.
         * @param value - parameter value.
         */
        public add(name: string, value: string | File | FileValue | URL | FileList | FilesValue): IParam {
            let param: IParam
            if (value instanceof FilesValue || value instanceof FileList) {
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