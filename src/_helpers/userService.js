import Vue from "vue";
import { authHeader } from './auth_header';
import axios from "axios";

export const userService = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
};


function getUsers() {
    Vue.$log.debug("Enter");

    const config = {
        headers: authHeader()
    }
    
    Vue.$log.debug("Header: " + JSON.stringify(config));

    return axios.get(process.env.VUE_APP_API_URL + '/users', config)
        .then(response => {
            const users = response.data;
            return users;
        })
        .catch(err => {
            Vue.$log.error("getUsers Failure: ");

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

function updateUser(user) {
    Vue.$log.debug("Enter")
    Vue.$log.debug("user changes" + JSON.stringify(user));

    const config = {
        headers: authHeader()
    }

    return axios.put(process.env.VUE_APP_API_URL + '/users/' + user.id, user.changes, config)
        .then(response => {
            Vue.$log.debug(response);
            const user = {};
            if (response.data.length > 0) {
                this.user = response.data[0];
            }
            return this.user;
        })
        .catch(err => {
            Vue.$log.error("updateUser Failure: ");

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

function deleteUser(user) {
    Vue.$log.debug("Enter")
    Vue.$log.debug("user changes" + user);

    const config = {
        headers: authHeader()
    }

    return axios.delete(process.env.VUE_APP_API_URL + '/users/' + user, config)
        .then(response => {
            Vue.$log.debug(response);
            const user = response.data;
            return user;
        })
        .catch(err => {
            Vue.$log.error("deleteUser Failure: ");

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

function createUser(user) {
    Vue.$log.debug("Enter")
    Vue.$log.debug("user: " + JSON.stringify(user));

    const config = {
        headers: authHeader()
    }

    return axios.post(process.env.VUE_APP_API_URL + '/users', user, config)
        .then(response => {
            Vue.$log.debug(response);
            const user = {};
            if (response.data.length > 0) {
                this.user = response.data[0];
            }
            return this.user;
        })
        .catch(err => {
            Vue.$log.error("createUser Failure: ");

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
