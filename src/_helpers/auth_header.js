import Vue from "vue";
import { router } from '@/_helpers';
import { isValidJwt } from "@/_helpers";

export function authHeader() {
    // return JWT token in auth header
    Vue.$log.debug("Enter");

    let user = JSON.parse(localStorage.getItem('user'));

    if (user && user.access_token) {
        if (isValidJwt(user.access_token)) {
            return { Authorization : 'Bearer ' + user.access_token};
        } else {
            Vue.$log.debug("JWT Token Expired. Sending user to login");
            router.push({ name: "Login" });

            /*
            Vue.$log.debug("JWT Token Expired. Lets see if we can refresh");
            
            store.dispatch('authentication/refreshJWT').then(response => {
                Vue.$log.debug("New token: " + response);
                return { Authorization : 'Bearer ' + response};
            }, error => {
              Vue.$log.debug("Token refresh Error");
              Vue.$log.error("Error: " + JSON.stringify(error));
              return next({ name: "Login" });
            });
            
            authService.refreshJWT()
                .then(
                    access_token => {
                        Vue.$log.debug("refresh JWT succesful");
                        return { Authorization : 'Bearer ' + access_token};
                    },
                    error => {
                        Vue.$log.error("JWT Refresh Error: " + error);
                        dispatch('authentication/logout');
                        dispatch('alert/error', error, { root: true });
                    }
                );
            */    
        }
    }
    else {
        return {};
    }
}

export function refreshAuthHeader() {
    // return JWT refresh token in auth header
    Vue.$log.debug("Enter");

    let user = JSON.parse(localStorage.getItem('user'));

    if (user && user.refresh_token) {
        return { Authorization : 'Bearer ' + user.refresh_token };
    }
    else {
        return {};
    }
}