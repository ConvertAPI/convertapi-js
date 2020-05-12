import Params from "./params.js"
import {IParams} from "./param.js"
import Result from "./result.js"

export interface Credentials {
    secret: string
    apiKey:  string
    token: string
}

export default class ConvertApi {
    constructor(
        public readonly credentials: Credentials,
        public readonly host: string='v2.convertapi.com'
    ) {}

    public createParams(): Params {
        return new Params(this.host)
    }

    public convert(fromFormat: string, toFormat: string, params: IParams): Promise<Result> {
        return Promise.resolve(params.dto)
            .then(dto => {
                let auth = this.credentials.secret ? `secret=${this.credentials.secret}` : `apikey=${this.credentials.apiKey}&token=${this.credentials.token}`
                return fetch(`https://${this.host}/convert/${fromFormat}/to/${toFormat}?${auth}&storefile=true`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(dto) })
                    .then(resp => resp.json())
                    .then(dto => new Result(dto))
            })
    }
}