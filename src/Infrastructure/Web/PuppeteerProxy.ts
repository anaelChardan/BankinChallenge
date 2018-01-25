import {launch, LaunchOptions, FrameBase, Page, Browser, Frame} from 'puppeteer';

/**
 * Wrapper for Puppeteer
 */
class PuppeteerProxy {
    constructor(private timeout: number = 60000) {}

    /**
     * Provide a browser and launch it
     */
    public async getAndLaunchBrowser() : Promise<Browser> {
        return await launch({timeout: this.timeout, headless: false});
    }

    /**
     * @param browser the browser
     */
    public async getNewPage(browser: Browser): Promise<Page> {
        return await browser.newPage();
    }

    /**
     * Wrapper for puppeteer openLink
     *
     * @param {Page} container the container on which you want to open a link
     * @param {string} url the url to open
     */
    public async openLink(container: Page, url: string): Promise<void> {
        await container.goto(url, {timeout: this.timeout})
    }

    /**
     * Wrapper for puppeteer click
     *
     * @param {Page} container the container on which you want to click an element
     * @param {string} selector the element's selector you want to click
     */
    public async clickOn(container: Page, selector: string): Promise<void> {
        await this.waitForSelector(container, selector);
        await container.click(selector);
    }

    /**
     * Wrapper for puppeteer waitForSelector
     *
     * @param {FrameBase} container the container on which you want to wait an element
     * @param {string} selector the element's selector you want to wait
     */
    public async waitForSelector(container: FrameBase, selector: string): Promise<void> {
        await container.waitForSelector(selector, {timeout: this.timeout});
    }
}

export default PuppeteerProxy;