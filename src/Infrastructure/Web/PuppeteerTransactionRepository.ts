import TransactionRepository from './../../Domain/TransactionRepository'
import Transaction from './../../Domain/Transaction'
import PuppeteerProxy from './PuppeteerProxy';
import BankinTransactionPage from './BankinTransactionPage';
import BankinTransactionRow from './BankinTransactionRow';
import { Browser } from 'puppeteer';

/**
 * Adapater of TransactionRepository for Puppeteer
 */
class PuppeteerTransactionRepository implements TransactionRepository {
    readonly NUMBER_OF_TRANSACTIONS_PER_PAGE: number = 50;

    /**
     * @param {PuppeteerProxy} puppeteerProxy the proxy for puppeteer
     * @param {Browser} browser Acts as an entityManager
     */
    constructor(private puppeteerProxy: PuppeteerProxy, private browser: Browser) {}

    /**
     * GetTransactions
     *
     * @param {number} from the page to fetch
     * 
     * @return {Promise<Transaction[]>} The promise transactions
     */
    async getTransactions(from: number): Promise<Transaction[]> {
        return new Promise<Transaction[]>(async (resolve, reject) => {
            const page = await this.browser.newPage();
            const transactionPage = new BankinTransactionPage(page, from, this.puppeteerProxy);
            const rawTransactions: BankinTransactionRow[] = await transactionPage.getRawTransactions();
            resolve(rawTransactions.map(rawTransaction => rawTransaction.toTransaction()));
            page.close();
        });
    }
}

export default PuppeteerTransactionRepository;