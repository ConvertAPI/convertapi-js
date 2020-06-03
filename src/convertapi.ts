namespace ConvertApi {
    interface Credentials {
        secret: string
        apiKey:  string
        token: string
    }

    /**
     * Returns ConvertApi object ready to use for conversions
     *
     * @param credentials - Your ConvertAPI credentials. Should be an `Object` with the `secret` or `apiKey` and `token` properties.
     * @param host - ConvertApi server domain name
     * @returns - New ConvertApi object
     */
    export function auth(credentials: Credentials, host?: string): ConvertApi {
        return new ConvertApi(credentials, host)
    }
    
    class ConvertApi {
        constructor(
            public readonly credentials: Credentials,
            public readonly host: string='v2.convertapi.com'
        ) {}

        /**
         * Returns initialized and ready to use new conversion parameters object.
         *
         * @returns - New conversion parameter object
         */
        public createParams(): Params {
            return new Params(this.host)
        }

        /**
         * Returns `Promise` to the `Result` object which can be used to retrieve converted files or chain result to the other conversions.
         *
         * @param fromFormat - Source file format (e.g. `docx`, `pdf`, ...)
         * @param toFormat - Destination file format (e.g. `pdf`, `jpg`, ...)
         * @param params - Conversion parameter object
         * @param converter - Alternative converter name
         * @returns - Promise that will resolve to `Result` object.
         */
        public convert(fromFormat: string, toFormat: string, params: IParams, converter?: string): Promise<Result> {
            return Promise.resolve(params.dto)
                .then(dto => {
                    let auth = this.credentials.secret ? `secret=${this.credentials.secret}` : `apikey=${this.credentials.apiKey}&token=${this.credentials.token}`
                    let converterPath = converter ? `/converter/${converter}` : ''
                    return fetch(`https://${this.host}/convert/${fromFormat}/to/${toFormat}${converterPath}?${auth}&storefile=true`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(dto) })
                        .then(resp => resp.json())
                        .then(dto => new Result(dto))
                })
        }
    }    
}