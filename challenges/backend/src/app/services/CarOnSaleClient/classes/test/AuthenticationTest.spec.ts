const dotenv = require('dotenv').config();
const request = require("request");
import { Util } from "../../../../lib/util";
import { assert } from 'chai';

describe("Authentication", () => {
  it("only registered user can log in", async () => {
    const options = {
      method: "PUT",
      url: `${process.env.API_BASE_URL}/authentication/${process.env.USER_MAIL_ID}`,
      json: true,
      body: {
        password: Util.hashPasswordWithCycles(process.env.USER_PASSWORD, 5),
        meta: ""
      }
    };

    request(options, (error, response, body) => {
      assert.equal(response.statusCode, 201);
    });
  });

  it("unregistered user can't log in", async () => {
    const options = {
      method: "PUT",
      url: `${process.env.API_BASE_URL}/authentication/${process.env.USER_MAIL_ID}`,
      json: true,
      body: {
        password: "",
        meta: ""
      }
    };

    request(options, (error, response, body) => {
      assert.equal(response.statusCode, 401);
    });
  });
});
