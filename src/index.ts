import PuppeteerTransactionRepository from "./Infrastructure/Web/PuppeteerTransactionRepository";
import PuppeteerProxy from "./Infrastructure/Web/PuppeteerProxy";
import { Browser } from "puppeteer";
import TransactionsFetcher from "./Application/TransactionsFetcher";
import BetterQueueTransactionQueue from "./Infrastructure/BetterQueueTransactionQueue";
import TransactionRepository from "./Domain/TransactionRepository";

async function main() {
    const puppeteerProxy: PuppeteerProxy = new PuppeteerProxy();
    const browser: Browser = await puppeteerProxy.getAndLaunchBrowser();
    const transactionRepository: TransactionRepository = new PuppeteerTransactionRepository(puppeteerProxy, browser);
    // const transactions = await transactionRepository.getTransactions(0);
    // console.log(transactions);
    // browser.close();
    try {
        const fetcher = new TransactionsFetcher(BetterQueueTransactionQueue, transactionRepository)
        await fetcher.fetch();
        // const transactions = await puppeteertransactionrpo.getTransactions(0);
        // console.log(transactions);
        // browser.close();
    } catch(error) {
        console.log(error);
    }
    
}

main();