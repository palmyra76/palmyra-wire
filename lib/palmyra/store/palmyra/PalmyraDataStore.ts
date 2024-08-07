import { DataStore } from "../AsyncStore";
import { APIErrorHandlerFactory, IEndPoint, PostRequest, PutRequest, RemoveRequest, strings } from "../Types";
import { PalmyraGridStore } from "./PalmyraGridStore";

class PalmyraDataStore<T> extends PalmyraGridStore implements DataStore<T> {
    constructor(request: Record<string, string>, endPoint: IEndPoint, factory?: APIErrorHandlerFactory, idProperty?: strings) {
        super(request, endPoint, factory, idProperty);
    }

    save(data: any, request?: PostRequest): Promise<T> {
        var urlFormat = this.target + this.postUrl();
        var url: any = this.formatUrl(urlFormat, request);

        return this.isUrlValid(url) || this.getClient().post(url, data, { headers: { action: 'save' } })
            .then(response => response.data?.result)
            .catch(error => this.handleError(error, request));
    }

    post(data: any, request?: PostRequest): Promise<T> {
        var urlFormat = this.target + this.postUrl();
        var url: any = this.formatUrl(urlFormat, request);
        return this.isUrlValid(url) || this.getClient().post(url, data)
            .then(response => response.data?.result)
            .catch(error => this.handleError(error, request));
    }

    put(data: any, request?: PutRequest): Promise<T> {
        var urlFormat = this.target + this.putUrl();
        var url: any = this.formatUrl(urlFormat, request);
        return this.isUrlValid(url) || this.getClient().put(url, data)
            .then(response => response.data?.result)
            .catch(error => this.handleError(error, request));
    }

    remove(key: any, request?: RemoveRequest): Promise<T> {
        var urlFormat = this.target + this.deleteUrl();
        var url: any = this.formatUrl(urlFormat, key);
        return this.isUrlValid(url) || this.getClient().delete(url, { data: {} })
            .then(response => response.data?.result)
            .catch(error => this.handleError(error, request));
    }

}

export { PalmyraDataStore };
