import axios, { AxiosInstance } from 'axios';

import { AbstractRequest, APIErrorHandlerFactory, IEndPoint, QueryParams, StoreOptions } from '../Types';
import { hasUnfilledParameter, StringFormat } from '../../utils/StringUtil';

class PalmyraAbstractStore {
    options: StoreOptions;
    target: string
    endPoint: IEndPoint
    axiosInstance: AxiosInstance

    constructor(baseUrl: string, endPoint: IEndPoint, options: StoreOptions,
        handlerFactory?: APIErrorHandlerFactory) {
        this.axiosInstance = axios.create({
            timeout: 5000
        });

        const factory = handlerFactory || (() => (error) => {
            const url = error.request.responseURL || error.config.url
            console.log(error.response.status + ":" + error.code + "-requestUrl:" + url);
            console.log(error.message + " -- response data:'" + error.response.data + "'");
        });

        axios.interceptors.response.use(undefined, function (error) {
            error.handleGlobally = factory(error);
            return Promise.reject(error);
        })

        this.options = options;
        this.target = baseUrl;
        this.endPoint = endPoint;
    }

    queryUrl(): string {
        if (typeof this.endPoint == 'string') {
            return this.endPoint;
        } else {
            return this.endPoint.query;
        }
    }

    getUrl(): string {
        if (typeof this.endPoint == 'string') {
            return this.endPoint;
        } else {
            return this.endPoint.get;
        }
    }

    postUrl(): string {
        const ep: IEndPoint = this.getEndPoint();
        if (typeof ep == 'string') {
            return ep;
        } else {
            return ep.post ? ep.post : ep.get;
        }
    }

    putUrl(): string {
        const ep: IEndPoint = this.getEndPoint();
        if (typeof ep == 'string') {
            return ep;
        } else {
            return ep.put;
        }
    }

    deleteUrl(): string {
        const ep: IEndPoint = this.getEndPoint();
        if (typeof ep == 'string') {
            return ep;
        } else {
            return ep.delete ? ep.delete : ep.put;
        }
    }

    getClient(): AxiosInstance {
        return axios;
    }

    getEndPoint(): IEndPoint {
        return this.endPoint;
    }

    getOptions(): Record<string, string | number> {
        return this.options?.endPointOptions || {};
    }

    getTarget(): string {
        return this.target;
    }

    formatUrl(urlFormat: string, request?: AbstractRequest): string {
        if (request)
            return StringFormat(StringFormat(urlFormat, request.options), request.endPointVars);
        else
            return urlFormat;
    }

    isUrlValid(url: string): any {
        if (hasUnfilledParameter(url)) {
            return Promise.reject("endPoint options yet to be populated " + url);
        }
        return false;
    }

    handleError(error: any, request?: AbstractRequest): Promise<never> {
        if (request?.errorHandler) {
            if (request.errorHandler(error))
                return Promise.reject(error);
        }
        error.handleGlobally(error);
        return Promise.reject(error);
    }

    convertQueryParams(queryParams: QueryParams, limit: number = 15): any {
        const sortOrder = queryParams?.sortOrder || {};
        const orderBy = Object.keys(sortOrder).map(field => {
            const order = sortOrder[field] === "asc" ? "+" : "-";
            return order + field;
        });

        const _total: boolean = queryParams.total ? true : false;

        const _f = queryParams.filter || {};

        const _offset = queryParams.offset || 0;
        const _limit = queryParams.limit || limit;

        return { ..._f, _total, _orderBy: orderBy.length ? orderBy.join(',') : [], _offset, _limit };
    }
}

export { PalmyraAbstractStore };
