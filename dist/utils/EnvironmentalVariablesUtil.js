"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EnvironmentalVariablesUtil {
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
}
exports.default = EnvironmentalVariablesUtil;
EnvironmentalVariablesUtil.ACCESS_TOKEN_SECRET = process.env
    .ACCESS_TOKEN_SECRET;
EnvironmentalVariablesUtil.REFRESH_TOKEN_SECRET = process.env
    .REFRESH_TOKEN_SECRET;
EnvironmentalVariablesUtil.ACCESS_TOKEN_EXPIRATION = process.env
    .ACCESS_TOKEN_EXPIRATION;
EnvironmentalVariablesUtil.REFRESH_TOKEN_EXPIRATION = process.env
    .REFRESH_TOKEN_EXPIRATION;
