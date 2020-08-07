import Vue from "vue";
import { authHeader } from './auth_header';
import axios from "axios";

export const hostService = {
    getHosts,
    createHost,
    updateHost,
    deleteHost
};


function getHosts() {
    Vue.$log.debug("Enter");

    const config = {
        headers: authHeader()
    };
    
    Vue.$log.debug("Header: " + JSON.stringify(config));

    return axios.get(process.env.VUE_APP_API_URL + '/hosts', config)
        .then(response => {
            const hosts = response.data;
            return hosts;
        })
        .catch(err => {
            Vue.$log.error("getHosts Failure: ");

            var error = '';

            if (err.response) {
                Vue.$log.error("err.response: " + JSON.stringify(err.response));
                error = err.response.data.msg;
            }
            else if (err.request) {
                Vue.$log.error("err.request: " + err.request);
                error = err.request
            }
            else {
                Vue.$log.error("err.message: " + err.message);
                error = err.message;
            }
            Vue.$log.debug("error: " + error);
            return Promise.reject(error);
        });
}

function updateHost(host) {
    Vue.$log.debug("Enter")
    Vue.$log.debug("host changes" + JSON.stringify(host));

    const config = {
        headers: authHeader()
    }

    return axios.put(process.env.VUE_APP_API_URL + '/hosts/' + host.cn, host.changes, config)
        .then(response => {
            Vue.$log.debug(response);
            const host = response.data;
            return host;
        })
        .catch(err => {
            Vue.$log.error("updateHost Failure: ");

            var error = '';

            if (err.response) {
                Vue.$log.error("err.response: " + JSON.stringify(err.response));
                error = err.response.data.msg;
            }
            else if (err.request) {
                Vue.$log.error("err.request: " + err.request);
                error = err.request
            }
            else {
                Vue.$log.error("err.message: " + err.message);
                error = err.message;
            }
            Vue.$log.debug("error: " + error);
            return Promise.reject(error);
        });
}

function deleteHost(host) {
    Vue.$log.debug("Enter")
    Vue.$log.debug("host changes" + host);

    const config = {
        headers: authHeader()
    }

    return axios.delete(process.env.VUE_APP_API_URL + '/hosts/' + host, config)
        .then(response => {
            Vue.$log.debug(response);
            const host = response.data;
            return host;
        })
        .catch(err => {
            Vue.$log.error("deleteHost Failure: ");

            var error = '';

            if (err.response) {
                Vue.$log.error("err.response: " + JSON.stringify(err.response));
                error = err.response.data.msg;
            }
            else if (err.request) {
                Vue.$log.error("err.request: " + err.request);
                error = err.request
            }
            else {
                Vue.$log.error("err.message: " + err.message);
                error = err.message;
            }
            Vue.$log.debug("error: " + error);
            return Promise.reject(error);
        });
}

function createHost(host) {
    Vue.$log.debug("Enter");
    Vue.$log.debug("host: " + JSON.stringify(host));

    const config = {
        headers: authHeader()
    }

    return axios.post(process.env.VUE_APP_API_URL + '/hosts', host, config)
        .then(response => {
            Vue.$log.debug(response);
            const host = response.data;
            return host;
        })
        .catch(err => {
            Vue.$log.error("createHost Failure: ");

            var error = '';

            if (err.response) {
                Vue.$log.error("err.response: " + JSON.stringify(err.response));
                error = err.response.data.msg;
            }
            else if (err.request) {
                Vue.$log.error("err.request: " + err.request);
                error = err.request
            }
            else {
                Vue.$log.error("err.message: " + err.message);
                error = err.message;
            }
            Vue.$log.debug("error: " + error);
            return Promise.reject(error);
        });
}
