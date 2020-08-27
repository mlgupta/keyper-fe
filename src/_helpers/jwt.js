/****************************************************************************
*                       Confidentiality Information                         *
*                                                                           *
* This module is the confidential and proprietary information of            *
* DBSentry Corp.; it is not to be copied, reproduced, or transmitted in any *
* form, by any means, in whole or in part, nor is it to be used for any     *
* purpose other than that for which it is expressly provided without the    *
* written permission of DBSentry Corp.                                      *
*                                                                           *
* Copyright (c) 2020-2021 DBSentry Corp.  All Rights Reserved.              *
*                                                                           *
****************************************************************************/
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

