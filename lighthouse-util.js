import puppeteer from "puppeteer";
import lighthouse from "lighthouse"; 

export function createBrowser() {
   return puppeteer.launch({
     args: ["--show-paint-rects"] // Required by lighthouse
   });

}

export function createReportWithBrowser(browser, url, options = { output: "html" }) {
// Allows us to communicate via DevTools protocol
  const endpoint = browser.wsEndpoint(); 
  const endpointURL = new URL(endpoint); // Lighthouse only cares about the port, so we have to parse the URL so we can grab the port to talk to Chrome on
  return lighthouse(
    url,
    Object.assign({}, {
      port: endpointURL.port
    }, options) // Allow options to override anything here
  );
}

