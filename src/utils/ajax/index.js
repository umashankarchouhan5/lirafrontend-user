const axios = require("axios").default;

class Ajax {
    constructor(lib) {
        this.lib = lib;
        this.baseUrl = null;
        this.token = "Lira";
        this.onRequestStart = null;
        this.onRequestDone = null;
        this.onRequestFail = null;
        this.requestsStack = {}
    }

    setToken(token) {
        this.token = token;
    }

    addToStack(string) {
        this.requestsStack[string] = string
    }

    removeFromStack(string) {
        if (this.requestsStack[string]) {
            delete this.requestsStack[string]
        }
    }

    isStackEmpty() {
        return Object.keys(this.requestsStack).length === 0;
    }

    removeToken() {
        this.token = "Lira";
    }

    setBaseUrl(url) {
        this.baseUrl = url;
    }

    post(url, data, additionalHeaders, config) {
        return new Promise((resolve, reject) => {
            this.handleStart();
            this.addToStack(url);
            if (!url) {
                reject();
                return;
            }

            this.lib
                .post(`${this.baseUrl}/${url}`, data, {
                    headers: {
                        Authorization:  `Bearer ${this.token}`,
                        ...additionalHeaders
                    },
                    ...config
                })
                .then(response => {
                    this.removeFromStack(url);
                    this.handleSuccess(response, resolve, reject, this.isStackEmpty())
                })
                .catch(error => {
                    this.removeFromStack(url);
                    this.handleError(error, reject, this.isStackEmpty())
                });
        });
    }

    get(url, additionalHeaders) {
        return new Promise((resolve, reject) => {
            this.handleStart();
            this.addToStack(url);
            if (!url) {
                reject();
                return;
            }

            this.lib
                .get(`${this.baseUrl}/${url}`, {
                    headers: {
                        Authorization:  `Bearer ${this.token}`,
                        ...additionalHeaders
                    }
                })
                .then(response => {
                    this.removeFromStack(url);
                    this.handleSuccess(response, resolve, reject)
                })
                .catch(error => {
                    this.removeFromStack(url);
                    this.handleError(error, reject)
                });
        });
    }

    handleStart() {
        this.onRequestStart && this.onRequestStart(this.isStackEmpty());
    }

    handleSuccess(response, resolve, reject) {
        const { status } = response.data.response;
        if (!status) {
            this.handleError(response.data.response, reject)
        } else {
            this.onRequestDone && this.onRequestDone(this.isStackEmpty(),response.data.response);
            resolve(response.data.response);
        }

    }

    handleError(error, reject) {
        this.onRequestFail && this.onRequestFail(error, this.isStackEmpty());
        reject(error);
    }

    setRequestStart(callback) {
        this.onRequestStart = callback;
    }

    setRequestDone(callback) {
        this.onRequestDone = callback;
    }

    setRequestFail(callback) {
        this.onRequestFail = callback;
    }
}

export default new Ajax(axios);
