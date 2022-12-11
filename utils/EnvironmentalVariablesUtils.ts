export default class EnvironmentalVariablesUtil {
  ////vars
  private static ACCESS_TOKEN_SECRET: string = process.env
    .ACCESS_TOKEN_SECRET as string;
  private static REFRESH_TOKEN_SECRET: string = process.env
    .REFRESH_TOKEN_SECRET as string;
  private static ACCESS_TOKEN_EXPIRATION: string = process.env
    .ACCESS_TOKEN_EXPIRATION as string;
  private static REFRESH_TOKEN_EXPIRATION: string = process.env
    .REFRESH_TOKEN_EXPIRATION as string;
  private static TEAMCREST_WIDTH_LIMITER: string = process.env
    .TEAMCREST_WIDTH_LIMITER as string;
  private static TEAMCREST_HEIGHT_LIMITER: string = process.env
    .TEAMCREST_HEIGHT_LIMITER as string;

  static checkIfStringValueIsInteger(value: string) {
    if (Number.isNaN(parseInt(value))) return false;

    const isNumber = Number(value) && Number.isInteger(Number.parseInt(value));
    if (isNumber === 0) return false;

    return Number(value) && Number.isInteger(Number.parseInt(value));
  }

  ////getters
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
  static getImageWidthLimiter(): number {
    if (this.checkIfStringValueIsInteger(this.TEAMCREST_WIDTH_LIMITER))
      return Number.parseInt(this.TEAMCREST_WIDTH_LIMITER);

    throw new Error(
      "Value TEAMCREST_WIDTH_LIMITER given in ENV is not an integer!"
    );
  }
  static getImageHeightLimiter(): number {
    if (this.checkIfStringValueIsInteger(this.TEAMCREST_HEIGHT_LIMITER))
      return Number.parseInt(this.TEAMCREST_HEIGHT_LIMITER);

    throw new Error(
      "Value TEAMCREST_HEIGHT_LIMITER given in ENV is not an integer!"
    );
  }
}
