const dotenv = require("dotenv").config();
import { Util } from "./lib/util";
import { Container } from "inversify";
import { ILogger } from "./services/Logger/interface/ILogger";
import { Logger } from "./services/Logger/classes/Logger";
import { AuctionMonitorApp } from "./AuctionMonitorApp";
import { DependencyIdentifier } from "./DependencyIdentifiers";
import { ICarOnSaleClient } from "./services/CarOnSaleClient/interface/ICarOnSaleClient";
import { CarOnSaleClient } from "./services/CarOnSaleClient/classes/CarOnSaleClient";
import { IAuth } from "./services/CarOnSaleClient/interface/IAuth";
import { Auth } from "./services/CarOnSaleClient/classes/Auth";
/*
 * Create the DI container.
 */
const container = new Container({
  defaultScope: "Singleton"
});

/*
 * Register dependencies in DI environment.
 */
container.bind<ILogger>(DependencyIdentifier.LOGGER).to(Logger);
container.bind<IAuth>(DependencyIdentifier.AUTH).to(Auth);
container
  .bind<ICarOnSaleClient>(DependencyIdentifier.CLIENT)
  .to(CarOnSaleClient);

/*
 * Inject all dependencies in the application & retrieve application instance.
 */
const app = container.resolve(AuctionMonitorApp);

/*
 * Start the application
 */
(async () => {
  await app.start(
    process.env.USER_MAIL_ID,
    Util.hashPasswordWithCycles(process.env.USER_PASSWORD, 5)
  );
})();
