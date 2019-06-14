/**
 * This service describes an interface to access auction data from the CarOnSale API.
 */
export interface IAuth {
  setCredentials(userMailId: string, hashPwd: string): any;
  authenticate(): Promise<any>;
}
