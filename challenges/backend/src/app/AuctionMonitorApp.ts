import { inject, injectable } from "inversify";
import { ILogger } from "./services/Logger/interface/ILogger";
import { ICarOnSaleClient } from "./services/CarOnSaleClient/interface/ICarOnSaleClient";
import { IAuth } from "./services/CarOnSaleClient/interface/IAuth";
import { DependencyIdentifier } from "./DependencyIdentifiers";
import "reflect-metadata";

@injectable()
export class AuctionMonitorApp {
  public constructor(
    @inject(DependencyIdentifier.LOGGER) private logger: ILogger,
    @inject(DependencyIdentifier.AUTH) private auth: IAuth,
    @inject(DependencyIdentifier.CLIENT)
    private carOnSaleClient: ICarOnSaleClient
  ) {}

  public async start(userMailId: string, password: string): Promise<void> {
    this.logger.log(`Auction Monitor started.`);

    this.auth.setCredentials(userMailId, password);
    const authResponse = await this.auth.authenticate().catch(err => process.exit(-1));

    if (!authResponse.hasOwnProperty("token")) {
      process.exit(-1);
    }

    this.carOnSaleClient.setUserMailId(userMailId);
    this.carOnSaleClient.setAuthToken(authResponse.token);

    const auctionsJson = await this.carOnSaleClient.getRunningAuctions().catch(err => process.exit(-1));

    const auctions = JSON.parse(auctionsJson);

    // create an object with the sum of all bids and progress ratio
    const auctionTotalValue = auctions
      .map(auction => ({
        numBids: auction.numBids,
        progressRatio:
          auction.currentHighestBidValue / auction.minimumRequiredAsk
      }))
      .reduce(
        (total, curr) => ({
          numBids: total.numBids + curr.numBids,
          progressRatio: total.progressRatio + curr.progressRatio
        }),
        { numBids: 0, progressRatio: 0 }
      );

    const avgNumBids = auctionTotalValue.numBids / auctions.length;
    const avgPercProg =
      (auctionTotalValue.progressRatio / auctions.length) * 100;

    console.log("number of auctions: " + auctions.length);
    console.log("average number of bids per auction: " + avgNumBids);
    console.log(
      "average percentage of the auction progress: " + avgPercProg + "%"
    );

    process.exit(0);
  }
}
