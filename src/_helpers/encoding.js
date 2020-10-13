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

export const  base64ToBuf = function (str) {
  Vue.$log.debug("Enter");

  return Buffer.from(str, 'base64');
};

export const  bufToBase64 = function (u8) {
  return Buffer.from(u8).toString('base64');
};

export const  bufToBin = function (u8) {
  return Buffer.from(u8).toString('binary');
};

export const  bufToHex = function (u8) {
  return Buffer.from(u8).toString('hex');
};

export const  bufToUrlBase64 = function (u8) {
  return bufToBase64(u8)
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};
