
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
*****************************************************************************
* Original code source credit:                                              *
*    https://git.coolaj86.com/coolaj86/ssh-fingerprint.js                   *
*                                                                           *
****************************************************************************/
import Vue from "vue";
import  * as Enc  from "./encoding";
import { createHash } from "crypto";

const parse = function (opts) {
  var pub = opts.pub || opts;
  var ssh = parseBlock(pub);
  ssh = parseElements(ssh);
  //delete ssh.bytes;
  return parsePublicKey(ssh);
};

/*global Promise*/
export const fingerprint = function (opts) {
  Vue.$log.debug("Enter");

  var ssh;
  if (opts.bytes) {
    ssh = opts;
  } else {
    ssh = parseBlock(opts.pub);
  }
  Vue.$log.debug("After Enter");
  // for browser compat
  return Promise.resolve().then(function () {
    Vue.$log.debug("FP: " + 'SHA256:' + createHash('sha256')
    .update(ssh.bytes).digest('base64').replace(/=+$/g, ''));
    return 'SHA256:' + createHash('sha256')
      .update(ssh.bytes).digest('base64').replace(/=+$/g, '');
  });
};

const parseBlock = function (ssh) {
  Vue.$log.debug("Enter");


  ssh = ssh.split(/\s+/g);
  Vue.$log.debug("SSH: " + ssh[0] + ssh[1] + ssh[2]);

  return {
    type: ssh[0]
  , bytes: Enc.base64ToBuf(ssh[1])
  , comment: ssh[2]
  };
};

const parseElements = function (ssh) {
  var buf = ssh.bytes;
  var fulllen = buf.byteLength || buf.length;
  var offset = (buf.byteOffset || 0);
  var i = 0;
  var index = 0;
  // using dataview to be browser-compatible (I do want _some_ code reuse)
  var dv = new DataView(buf.buffer.slice(offset, offset + fulllen));
  var els = [];
  var el;
  var len;

  while (index < fulllen) {
    i += 1;
    if (i > 15) { throw new Error("15+ elements, probably not a public ssh key"); }
    len = dv.getUint32(index, false);
    index += 4;
    el = buf.slice(index, index + len);
    // remove BigUInt '00' prefix
    if (0x00 === el[0]) {
      el = el.slice(1);
    }
    els.push(el);
    index += len;
  }
  if (fulllen !== index) {
    throw new Error("invalid ssh public key length \n" + els.map(function (b) {
      return Enc.bufToHex(b);
    }).join('\n'));
  }

  ssh.elements = els;
  return ssh;
};

const parsePublicKey = function (ssh) {
  var els = ssh.elements;
  var typ = Enc.bufToBin(els[0]);
  var len;

  // RSA keys are all the same
  if (keyTypes.rsa === typ) {
    ssh.jwk = {
      kty: 'RSA'
    , n: Enc.bufToUrlBase64(els[2])
    , e: Enc.bufToUrlBase64(els[1])
    };
    return ssh;
  }

  // EC keys are each different
  if (keyTypes.p256 === typ) {
    len = 32;
    ssh.jwk = { kty: 'EC', crv: 'P-256' };
  } else if (keyTypes.p384 === typ) {
    len = 48;
    ssh.jwk = { kty: 'EC', crv: 'P-384' };
  } else {
    throw new Error("Unsupported ssh public key type: "
      + Enc.bufToBin(els[0]));
  }

  // els[1] is just a repeat of a subset of els[0]
  var x = els[2].slice(1, 1 + len);
  var y = els[2].slice(1 + len, 1 + len + len);

  // I don't think EC keys use 0x00 padding, but just in case
  while (0x00 === x[0]) { x = x.slice(1); }
  while (0x00 === y[0]) { y = y.slice(1); }

  ssh.jwk.x = Enc.bufToUrlBase64(x);
  ssh.jwk.y = Enc.bufToUrlBase64(y);

  return ssh;
};

const keyTypes = {
  // 19 '00000013'
  // e c d s a - s h a 2 - n i s t p 2 5 6
  // 65636473612d736861322d6e69737470323536
  // 6e69737470323536
  p256: 'ecdsa-sha2-nistp256'

  // 19 '00000013'
  // e c d s a - s h a 2 - n i s t p 3 8 4
  // 65636473612d736861322d6e69737470333834
  // 6e69737470323536
, p384: 'ecdsa-sha2-nistp384'

  // 7 '00000007'
  // s s h - r s a
  // 7373682d727361
, rsa: 'ssh-rsa'
, ed25519: 'ssh-ed25519'
};
