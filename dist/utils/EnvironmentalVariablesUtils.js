"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EnvironmentalVariablesUtil {
    static checkIfStringValueIsInteger(value) {
        if (Number.isNaN(parseInt(value)))
            return false;
        const isNumber = Number(value) && Number.isInteger(Number.parseInt(value));
        if (isNumber === 0)
            return false;
        return Number(value) && Number.isInteger(Number.parseInt(value));
    }
    ////getters
    static getAccessTokenSecret() {
        return this.ACCESS_TOKEN_SECRET;
    }
    static getRefreshTokenSecret() {
        return this.REFRESH_TOKEN_SECRET;
    }
    static getAccessTokenExpiration() {
        return this.ACCESS_TOKEN_EXPIRATION;
    }
    static getRefreshTokenExpiration() {
        return this.REFRESH_TOKEN_EXPIRATION;
    }
    static getImageWidthLimiter() {
        if (this.checkIfStringValueIsInteger(this.TEAMCREST_WIDTH_LIMITER))
            return Number.parseInt(this.TEAMCREST_WIDTH_LIMITER);
        throw new Error("Value TEAMCREST_WIDTH_LIMITER given in ENV is not an integer!");
    }
    static getImageHeightLimiter() {
        if (this.checkIfStringValueIsInteger(this.TEAMCREST_HEIGHT_LIMITER))
            return Number.parseInt(this.TEAMCREST_HEIGHT_LIMITER);
        throw new Error("Value TEAMCREST_HEIGHT_LIMITER given in ENV is not an integer!");
    }
}
exports.default = EnvironmentalVariablesUtil;
////vars
EnvironmentalVariablesUtil.ACCESS_TOKEN_SECRET = process.env
    .ACCESS_TOKEN_SECRET;
EnvironmentalVariablesUtil.REFRESH_TOKEN_SECRET = process.env
    .REFRESH_TOKEN_SECRET;
EnvironmentalVariablesUtil.ACCESS_TOKEN_EXPIRATION = process.env
    .ACCESS_TOKEN_EXPIRATION;
EnvironmentalVariablesUtil.REFRESH_TOKEN_EXPIRATION = process.env
    .REFRESH_TOKEN_EXPIRATION;
EnvironmentalVariablesUtil.TEAMCREST_WIDTH_LIMITER = process.env
    .TEAMCREST_WIDTH_LIMITER;
EnvironmentalVariablesUtil.TEAMCREST_HEIGHT_LIMITER = process.env
    .TEAMCREST_HEIGHT_LIMITER;
