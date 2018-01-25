import { Browser, Page, Dialog, ElementHandle, Frame, FrameBase } from "puppeteer";
import PuppeteerProxy from "./PuppeteerProxy";
import BankinTransactionRow from "./BankinTransactionRow";

/**
 * Represent the way to scrap a page
 */
class BankinTransactionPage {
    readonly BANKIN_TRANSACTION_PAGE_BASE_URL = 'https://web.bankin.com/challenge/index.html?start='
    readonly TRANSACTIONS_TABLE_WIDTH = 3;
    readonly BUTTON_RELOAD_CSS_SELECTOR = '#btnGenerate'
    readonly TRANSACTIONS_FRAME_CSS_ID = 'fm';
    readonly TRANSACTIONS_TABLE_BODY_SELECTOR ='table > tbody';
    readonly TRANSACTIONS_TABLE_ROW_CSS_SELECTOR = `${this.TRANSACTIONS_TABLE_BODY_SELECTOR} > tr`;
    readonly TRANSACTIONS_TABLE_CELL_CSS_SELECTOR = `${this.TRANSACTIONS_TABLE_ROW_CSS_SELECTOR} > td`;

    constructor(private page: Page, private from: number, private puppeteerProxy: PuppeteerProxy) {}

    /**
     * Get Transactions as a Row
     * 
     * @returns {Promise<BankinTransactionRow[] | any>} the result of the scrapping
     */
    async getRawTransactions(): Promise<BankinTransactionRow[] | any> {
        return new Promise<BankinTransactionRow[] | any>(async (resolve, reject) => {
            this.page.on('dialog', async (dialog: Dialog) => await this.dialogHandler(dialog));

            this.page.on('load', async () => {
                try {
                    const rawTransactions = await this.getRawTransactionsFromPage();
                    resolve(rawTransactions);
                } catch(exception) {
                    reject(exception);
                }
            });

            await this.puppeteerProxy.openLink(this.page, `${this.BANKIN_TRANSACTION_PAGE_BASE_URL}${this.from}`);
        });
    }

    /**
     * Will click ok on the dialog, to continue and then click on the reload button
     *
     * @param {Dialog} dialog the dialog to interact with
     */
    private async dialogHandler(dialog: Dialog): Promise<void> {
        await dialog.dismiss();
        await this.puppeteerProxy.clickOn(this.page, this.BUTTON_RELOAD_CSS_SELECTOR);
    }

    /**
     * 
     */
    private async getRawTransactionsFromPage(): Promise<BankinTransactionRow[]> {
        //Will return the first promise which answer, so the real transactions container
        const containerElement: FrameBase = await Promise.race<Frame, Page>([
            this.getIframeContainer(),
            this.getTransactionsTableBody()
        ]);

        //Wait for a row, because it can be the header only (last page)
        await containerElement.waitForSelector(this.TRANSACTIONS_TABLE_ROW_CSS_SELECTOR);

        const transactionsCells: string[] = await containerElement
            .$$eval(
                this.TRANSACTIONS_TABLE_CELL_CSS_SELECTOR,
                (elements: NodeListOf<Element>) => Object.values(elements).map(elem => elem.innerHTML)
            );

        return this.chunk(transactionsCells, this.TRANSACTIONS_TABLE_WIDTH).map(row => new BankinTransactionRow(row));
    }

    /**
     * Return the frame container of transactions
     * 
     * @returns {Promise<Frame>} the frame if it contains a frame
     */
    private async getIframeContainer(): Promise<Frame> {
        await this.puppeteerProxy.waitForSelector(this.page, 'iframe')
        const frame: Frame = this.page.frames().find(frame => this.TRANSACTIONS_FRAME_CSS_ID === frame.name())

        return Promise.resolve(frame)
    }

    /**
     * Return the table container of transactions
     * 
     * @returns {Promise<Page>} the page if it contains the table directly
     */
    private async getTransactionsTableBody(): Promise<Page> {
        await this.puppeteerProxy.waitForSelector(this.page, this.TRANSACTIONS_TABLE_BODY_SELECTOR);

        return Promise.resolve(this.page);
    }

    // THOSE TWO METHODS ABOVE BELONG TO LODASH
    // I didn't wanted to import the integrity of this one for 2 methods

    /**
     * Creates an array of elements split into groups the length of `size`.
     * If `array` can't be split evenly, the final chunk will be the remaining
     * elements.
     *
     * @see https://github.com/lodash/lodash/blob/master/chunk.js
     *
     * @param {Array} array The array to process.
     * @param {number} [size=1] The length of each chunk
     * @returns {Array} Returns the new array of chunks.
     */
    private chunk<T>(array: Array<T>, size: number): Array<Array<T>> {
        size = Math.max(size, 0)
        const length = array == null ? 0 : array.length
        if (!length || size < 1) {
          return []
        }
        let index = 0
        let resIndex = 0
        const result = new Array(Math.ceil(length / size))
      
        while (index < length) {
          result[resIndex++] = this.slice(array, index, (index += size))
        }
        return result
    }


    /**
     * Creates a slice of `array` from `start` up to, but not including, `end`.
     * @see https://github.com/lodash/lodash/blob/master/slice.js
     * 
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    private slice<T>(array: Array<T>, start: number, end: number): Array<T> {
        let length = array == null ? 0 : array.length
        if (!length) {
            return []
        }
        start = start == null ? 0 : start
        end = end === undefined ? length : end
        
        if (start < 0) {
            start = -start > length ? 0 : (length + start)
        }
        end = end > length ? length : end
        if (end < 0) {
            end += length
        }
        length = start > end ? 0 : ((end - start) >>> 0)
        start >>>= 0
        
        let index = -1
        const result = new Array(length)
        while (++index < length) {
            result[index] = array[index + start]
        }
        return result
    }
}

export default BankinTransactionPage;