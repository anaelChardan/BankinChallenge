import TransactionRepository from './../../Domain/TransactionRepository'
import Transaction from './../../Domain/Transaction'
import PuppeteerProxy from './PuppeteerProxy';
import BankinTransactionPage from './BankinTransactionPage';
import BankinTransactionRow from './BankinTransactionRow';
import { Browser } from 'puppeteer';

class PuppeteerTransactionRepository implements TransactionRepository {
    readonly NUMBER_OF_TRANSACTIONS_PER_PAGE: number = 50;

    constructor(private puppeteerProxy: PuppeteerProxy, private browser: Browser) {}

    async getTransactions(from: number): Promise<Transaction[]> {
        console.log('getTransaction', from)
        return new Promise<Transaction[]>(async (resolve, reject) => {
            try {
                const page = await this.browser.newPage();
                const transactionPage = new BankinTransactionPage(page, from, this.puppeteerProxy);
                const rawTransactions: BankinTransactionRow[] = await transactionPage.getRawTransactions();
                resolve(rawTransactions.map(rawTransaction => rawTransaction.toTransaction()));
                page.close();
            } catch (error) {
                console.log('ERROR', error);
            }
        });
    }
}

export default PuppeteerTransactionRepository;