const dotenv = require("dotenv").config();
const request = require("request");
import { Util } from "../../../../lib/util";
import { assert } from "chai";
import { expect } from "chai";

let authResponse;

// now let's login the user before we run any tests
before(async () => {
  const options = {
    method: "PUT",
    url: `${process.env.API_BASE_URL}/authentication/${process.env.USER_MAIL_ID}`,
    json: true,
    body: {
      password: Util.hashPasswordWithCycles(process.env.USER_PASSWORD, 5),
      meta: ""
    }
  };

  authResponse = await new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) {
        return reject(error);
      }
      return resolve(body);
    });
  });
});

describe("Auctions Access", () => {
  it("an autheticated user can retrieve auctions", async () => {
    const userData = {
      userMailId: process.env.USER_MAIL_ID,
      filter: ""
    };

    const options = {
      method: "GET",
      url: `${process.env.API_BASE_URL}/auction/salesman/${process.env.USER_MAIL_ID}/_all`,
      headers: {
        userid: process.env.USER_MAIL_ID,
        authtoken: authResponse.token
      },
      body: JSON.stringify(userData)
    };

    request(options, (error, response, body) => {
      assert.equal(response.statusCode, 200);
    });
  });

  it("a non-autheticated user can't retrieve auctions", async () => {
    const userData = {
      userMailId: process.env.USER_MAIL_ID,
      filter: ""
    };

    const options = {
      method: "GET",
      url: `${process.env.API_BASE_URL}/auction/salesman/${process.env.USER_MAIL_ID}/_all`,
      headers: {
        userid: process.env.USER_MAIL_ID
      },
      body: JSON.stringify(userData)
    };

    request(options, (error, response, body) => {
      assert.equal(response.statusCode, 401);
    });
  });
});

describe("Auctions Data", () => {
  it("an auction has always the metadata numBids, currentHighestBidValue, minimumRequiredAsk ", async () => {
    const userData = {
      userMailId: process.env.USER_MAIL_ID,
      filter: ""
    };

    const options = {
      method: "GET",
      url: `${process.env.API_BASE_URL}/auction/salesman/${process.env.USER_MAIL_ID}/_all`,
      headers: {
        userid: process.env.USER_MAIL_ID,
        authtoken: authResponse.token
      },
      body: JSON.stringify(userData)
    };

    request(options, (error, response, body) => {
      JSON.parse(body).map(auction => {
        expect(auction).to.have.property("numBids");
        expect(auction).to.have.property("currentHighestBidValue");
        expect(auction).to.have.property("minimumRequiredAsk");
      });
    });
  });
});
