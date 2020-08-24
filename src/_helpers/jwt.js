import Vue from "vue";

export function isValidJwt(jwt) {
    Vue.$log.debug("Enter");
    if (!jwt || jwt.split('.').length < 3) {
        return false;
    }
    const data = JSON.parse(atob(jwt.split('.')[1]));
    Vue.$log.debug("data: " + JSON.stringify(data));

    const exp = new Date(data.exp * 1000);
    const now = new Date;
    return now < exp;
}

export function getUserClaims(jwt) {
    Vue.$log.debug("Enter");

    var role = "";
    if (!jwt || jwt.split('.').length < 3) {
        return role;
    }
    const data = JSON.parse(atob(jwt.split('.')[1]));
    Vue.$log.debug("data: " + JSON.stringify(data));

    if ("user_claims" in data) {
        role = data["user_claims"].split(":")[1];
        role = role.replace("}","").trim();
    }
    Vue.$log.debug("role: " + role);

    return role;

}

