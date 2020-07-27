namespace ConvertApi {
    export interface UploadResponseDto {
        FileId: string
        FileName: string,
        FileExt: string
    }
    
    export class FileValue {
        constructor(
            public readonly name: string,
            public readonly fileId: string
        ) {}
    }
    
    export class FileParam implements IParam {
        /**
         * Single file conversion parameter class.
         * 
         * @param name - parameter name.
         * @param file - value.
         * @param host - ConvertApi server domain.
         */
        constructor(
            public readonly name: string,
            public readonly file: File | FileValue | URL,
            public readonly host: string
        ) {}
    
        public value(): Promise<string> {
            if (this.file instanceof FileValue) {
                return Promise.resolve(this.file.fileId)                
            } else {
                let uploadUrl = `https://${this.host}/upload?`
                let response = this.file instanceof URL
                    ? fetch(`${uploadUrl}url=${this.file.href}`, <RequestInit>{ method: 'POST' })
                    : fetch(`${uploadUrl}filename=${this.file.name}`, <RequestInit>{ method: 'POST', body: this.file })
                return response.then(r => <Promise<UploadResponseDto>>r.json()).then(obj => obj.FileId)
            }
        }
    
        public get dto(): Promise<IParamDto> {
            return this.value().then( v => <IParamDto>{
                Name: this.name,
                FileValue: <IFileValue>{ Id: v }
            })
        }
    }
}