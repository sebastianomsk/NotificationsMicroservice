'use strict';

const reg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;

function validateEmail ($email) {
    return reg.test($email);
}

module.exports = validateEmail;
