const dotenv = require("dotenv").config();
const request = require("request");
import { IAuth } from "../interface/IAuth";
import { injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class Auth implements IAuth {
  private _userMailId: string;
  private _hashPwd: string;

  public setUserMailId(userMailId: string) {
    this._userMailId = userMailId;
  }
  public setHashPwd(hashPwd: string) {
    this._hashPwd = hashPwd;
  }
  public setCredentials(userMailId: string, hashPwd: string) {
    this.setUserMailId(userMailId);
    this.setHashPwd(hashPwd);
  }
  public authenticate(): Promise<any> {
    const options = {
      method: "PUT",
      url: `${process.env.API_BASE_URL}/authentication/${this._userMailId}`,
      json: true,
      body: { password: this._hashPwd, meta: "" }
    };

    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (error) {
          return reject(error);
        }
        return resolve(body);
      });
    });
  }
}
