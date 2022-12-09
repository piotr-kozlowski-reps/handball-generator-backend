export default class EnvironmentalVariablesUtil {
  private static ACCESS_TOKEN_SECRET: string = process.env
    .ACCESS_TOKEN_SECRET as string;
  private static REFRESH_TOKEN_SECRET: string = process.env
    .REFRESH_TOKEN_SECRET as string;
  private static ACCESS_TOKEN_EXPIRATION: string = process.env
    .ACCESS_TOKEN_EXPIRATION as string;
  private static REFRESH_TOKEN_EXPIRATION: string = process.env
    .REFRESH_TOKEN_EXPIRATION as string;

  static getAccessTokenSecret(): string {
    return this.ACCESS_TOKEN_SECRET;
  }
  static getRefreshTokenSecret(): string {
    return this.REFRESH_TOKEN_SECRET;
  }
  static getAccessTokenExpiration(): string {
    return this.ACCESS_TOKEN_EXPIRATION;
  }
  static getRefreshTokenExpiration(): string {
    return this.REFRESH_TOKEN_EXPIRATION;
  }
}
