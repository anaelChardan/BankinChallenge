import PuppeteerTransactionRepository from "./Infrastructure/Web/PuppeteerTransactionRepository";
import PuppeteerProxy from "./Infrastructure/Web/PuppeteerProxy";
import { Browser } from "puppeteer";
import TransactionsFetcher from "./Application/TransactionsFetcher";
import BetterQueueTransactionQueue from "./Infrastructure/BetterQueueTransactionQueue";
import TransactionRepository from "./Domain/TransactionRepository";
import Transactions from "./Domain/Transactions";
import TransactionsSaver from "./Application/TransactionsSaver";
import FileTransactionsSaver from "./Infrastructure/FileSystem/FileTransactionsSaver";

//Main function which acts as a dependency injector too
async function main() {
    const puppeteerProxy: PuppeteerProxy = new PuppeteerProxy();
    const browser: Browser = await puppeteerProxy.getAndLaunchBrowser();
    const transactionRepository: TransactionRepository = new PuppeteerTransactionRepository(puppeteerProxy, browser);
    const transactionsSaver: TransactionsSaver = new FileTransactionsSaver();

    try {
        const fetcher = new TransactionsFetcher(
            BetterQueueTransactionQueue, 
            transactionRepository, 
            (transactions: Transactions) => {
                transactionsSaver.save(transactions);
                browser.close();
            });
        fetcher.fetch();
    } catch(error) {
        console.log(error);
    }
    
}

main();