const dotenv = require("dotenv").config();
const request = require("request");
import { ICarOnSaleClient } from "../interface/ICarOnSaleClient";
import { injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class CarOnSaleClient implements ICarOnSaleClient {
  private _userMailId: string;
  private _userId: string;
  private _authToken: string;

  public setUserMailId(userMailId: string) {
    this._userMailId = userMailId;
  }
  public setAuthToken(authToken: string) {
    this._authToken = authToken;
  }
  public getRunningAuctions(): Promise<string> {
    const userData = {
      userMailId: this._userMailId,
      filter: ""
    };

    const options = {
      method: "GET",
      url: `${process.env.API_BASE_URL}/auction/salesman/${this._userMailId}/_all`,
      headers: {
        userid: this._userMailId,
        authtoken: this._authToken
      },
      body: JSON.stringify(userData)
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

  public getTotalAuctions(): Promise<number> {
    const userData = {
      userMailId: this._userMailId,
      filter: ""
    };

    const options = {
      method: "GET",
      url: `${process.env.API_BASE_URL}/auction/salesman/${this._userMailId}/_count`,
      headers: {
        userid: this._userMailId,
        authtoken: this._authToken
      },
      body: JSON.stringify(userData)
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
