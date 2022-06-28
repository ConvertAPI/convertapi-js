import Params, {IParamInit} from "./params.js";
import {IParams} from "./param.js";
import Result, {IResultErrorDto} from "./result.js";

interface TokenCredentials {
    apiKey:  string
    token: string
}

export default class ConvertApi {

    /**
     * Returns ConvertApi object ready to use for conversions
     *
     * @param credentials - Your ConvertAPI credentials. Should be an `Object` with the `secret` or `apiKey` and `token` properties.
     * @param host - ConvertApi server domain name
     * @returns - New ConvertApi object
     */
    static auth(credentials: string | TokenCredentials, host?: string): ConvertApi {
        return new ConvertApi(credentials, host)
    }

    constructor(
        public readonly credentials: string | TokenCredentials,
        public readonly host: string='v2.convertapi.com'
    ) {}

    /**
     * Returns initialized and ready to use new conversion parameters object.
     *
     * @returns - New conversion parameter object
     */
    public createParams(init?: IParamInit[]): Params {
        return new Params(this.host, init)
    }

    /**
     * Returns `Promise` to the `Result` object which can be used to retrieve converted files or chain result to the other conversions.
     *
     * @param fromFormat - Source file format (e.g. `docx`, `pdf`, ...)
     * @param toFormat - Destination file format (e.g. `pdf`, `jpg`, ...)
     * @param params - Conversion parameter object
     * @returns - Promise that will resolve to `Result` object.
     */
    public convert(fromFormat: string, toFormat: string, params: IParams): Promise<Result> {
        return Promise.resolve(params.dto)
            .then(dto => {
                let altConvParam = dto.Parameters.filter(p => p.Name.toLowerCase() == 'converter')
                let converterPath = altConvParam?.length > 0 ? `/converter/${altConvParam[0].Value}` : ''                    
                
                let auth = typeof this.credentials === 'string' ? `secret=${this.credentials}` : `apikey=${this.credentials.apiKey}&token=${this.credentials.token}`
                return fetch(`https://${this.host}/convert/${fromFormat}/to/${toFormat}${converterPath}?${auth}&storefile=true`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(dto) })
                    .then(r => Promise.all([r.ok, r.json()]))
                    .then(([ok, o]) => ok ? o : Promise.reject<IResultErrorDto>(o))
                    .then(dto => new Result(dto))
            })
    }
}