import { DataStore } from "../AsyncStore";
import { APIErrorHandlerFactory, IEndPoint, noopTransform, PostRequest, PutRequest, RemoveRequest, StoreOptions, strings } from "../Types";
import { PalmyraGridStore } from "./PalmyraGridStore";

class PalmyraDataStore<T> extends PalmyraGridStore implements DataStore<T> {
    constructor(baseUrl: string, endPoint: IEndPoint, options: StoreOptions,
        factory?: APIErrorHandlerFactory, idProperty?: strings) {
        super(baseUrl, endPoint, options, factory);
    }

    save(data: any, request?: PostRequest): Promise<T> {
        var urlFormat = this.target + this.postUrl();
        var url: any = this.formatUrl(urlFormat, request);
        const onResult = request?.transformResult || noopTransform;
        return this.isUrlValid(url) || this.getClient().post(url, data, { headers: { action: 'save' } })
            .then(response => onResult(response.data?.result))
            .catch(error => this.handleError(error, request));
    }

    post(data: any, request?: PostRequest): Promise<T> {
        var urlFormat = this.target + this.postUrl();
        const onResult = request?.transformResult || noopTransform;
        var url: any = this.formatUrl(urlFormat, request);
        return this.isUrlValid(url) || this.getClient().post(url, data)
            .then(response => onResult(response.data?.result))
            .catch(error => this.handleError(error, request));
    }

    put(data: any, request?: PutRequest): Promise<T> {
        var urlFormat = this.target + this.putUrl();
        const onResult = request?.transformResult || noopTransform;
        var url: any = this.formatUrl(urlFormat, request);
        return this.isUrlValid(url) || this.getClient().put(url, data)
            .then(response => onResult(response.data?.result))
            .catch(error => this.handleError(error, request));
    }

    remove(key: any, request?: RemoveRequest): Promise<T> {
        var urlFormat = this.target + this.deleteUrl();
        const onResult = request?.transformResult || noopTransform;
        var url: any = this.formatUrl(urlFormat, key);
        return this.isUrlValid(url) || this.getClient().delete(url, { data: {} })
            .then(response => onResult(response.data?.result))
            .catch(error => this.handleError(error, request));
    }

}

export { PalmyraDataStore };
