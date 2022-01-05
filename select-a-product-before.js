const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    async function waitForSelectors(selectors, frame) {
      for (const selector of selectors) {
        try {
          return await waitForSelector(selector, frame);
        } catch (err) {
          console.error(err);
        }
      }
      throw new Error('Could not find element for selectors: ' + JSON.stringify(selectors));
    }

    async function waitForSelector(selector, frame) {
      if (selector instanceof Array) {
        let element = null;
        for (const part of selector) {
          if (!element) {
            element = await frame.waitForSelector(part);
          } else {
            element = await element.$(part);
          }
          if (!element) {
            throw new Error('Could not find element: ' + part);
          }
          element = (await element.evaluateHandle(el => el.shadowRoot ? el.shadowRoot : el)).asElement();
        }
        if (!element) {
          throw new Error('Could not find element: ' + selector.join('|'));
        }
        return element;
      }
      const element = await frame.waitForSelector(selector);
      if (!element) {
        throw new Error('Could not find element: ' + selector);
      }
      return element;
    }

    async function waitForElement(step, frame) {
      const count = step.count || 1;
      const operator = step.operator || '>=';
      const comp = {
        '==': (a, b) => a === b,
        '>=': (a, b) => a >= b,
        '<=': (a, b) => a <= b,
      };
      const compFn = comp[operator];
      await waitForFunction(async () => {
        const elements = await querySelectorsAll(step.selectors, frame);
        return compFn(elements.length, count);
      });
    }

    async function querySelectorsAll(selectors, frame) {
      for (const selector of selectors) {
        const result = await querySelectorAll(selector, frame);
        if (result.length) {
          return result;
        }
      }
      return [];
    }

    async function querySelectorAll(selector, frame) {
      if (selector instanceof Array) {
        let elements = [];
        let i = 0;
        for (const part of selector) {
          if (i === 0) {
            elements = await frame.$$(part);
          } else {
            const tmpElements = elements;
            elements = [];
            for (const el of tmpElements) {
              elements.push(...(await el.$$(part)));
            }
          }
          if (elements.length === 0) {
            return [];
          }
          const tmpElements = [];
          for (const el of elements) {
            const newEl = (await el.evaluateHandle(el => el.shadowRoot ? el.shadowRoot : el)).asElement();
            if (newEl) {
              tmpElements.push(newEl);
            }
          }
          elements = tmpElements;
          i++;
        }
        return elements;
      }
      const element = await frame.$$(selector);
      if (!element) {
        throw new Error('Could not find element: ' + selector);
      }
      return element;
    }

    async function waitForFunction(fn) {
      let isActive = true;
      setTimeout(() => {
        isActive = false;
      }, 5000);
      while (isActive) {
        const result = await fn();
        if (result) {
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      throw new Error('Timed out');
    }
    {
        const targetPage = page;
        await targetPage.setViewport({"width":861,"height":821})
    }
    {
        const targetPage = page;
        const promises = [];
        promises.push(targetPage.waitForNavigation());
        await targetPage.goto('https://www.tokopedia.com/');
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/Bidang pencarian"],["#search-container > form > div > div > div > input"]], targetPage);
        await element.click({ offset: { x: 69, y: 16} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/Bidang pencarian"],["#search-container > form > div > div > div > input"]], targetPage);
        const type = await element.evaluate(el => el.type);
        if (["textarea","select-one","text","url","tel","search","password","number","email"].includes(type)) {
          await element.type('macbook pro');
        } else {
          await element.focus();
          await element.evaluate((el, value) => {
            el.value = value;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }, "macbook pro");
        }
    }
    {
        const targetPage = page;
        const promises = [];
        promises.push(targetPage.waitForNavigation());
        const element = await waitForSelectors([["#search-container > div > div > div > a:nth-child(1) > div > div > span > strong:nth-child(1)"]], targetPage);
        await element.click({ offset: { x: 31, y: 7.96875} });
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        await targetPage.evaluate((x, y) => { window.scroll(x, y); }, 0, 290)
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/Lihat Produk"],["#catalog-catalogInfo > div.css-svbnq2 > div > div.css-q452l1 > button"]], targetPage);
        await element.click({ offset: { x: 68.90625, y: 35} });
    }
    {
        const targetPage = page;
        await targetPage.evaluate((x, y) => { window.scroll(x, y); }, 0, 2646)
    }
    {
        const targetPage = page;
        const promises = [];
        promises.push(targetPage.waitForNavigation());
        const element = await waitForSelectors([["aria/Apple Macbook Pro 2020 M1 8GB 512GB SSD MYD92 MYDC2 Gray Silver Resmi - c8df[role=\"img\"]"],["#\\31 342266025 > div > div > div > div > div.css-zimbi > a > div > img"]], targetPage);
        await element.click({ offset: { x: 46.5625, y: 71.28125} });
        await Promise.all(promises);
    }

    await browser.close();
})();
