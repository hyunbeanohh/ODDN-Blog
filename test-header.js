const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Step 1: Initial page load
  console.log('Step 1: Loading homepage...');
  await page.goto('http://localhost:8000', { 
    waitUntil: 'networkidle2',
    timeout: 30000 
  });
  await page.screenshot({ path: 'step1-homepage.png', fullPage: true });
  console.log('Screenshot 1 saved: step1-homepage.png');
  
  // Step 2: Click Engineering category
  console.log('\nStep 2: Clicking Engineering button...');
  await page.waitForSelector('button:has-text("Engineering"), a:has-text("Engineering")', { timeout: 5000 });
  const engineeringButton = await page.$('button:has-text("Engineering"), a:has-text("Engineering")');
  if (engineeringButton) {
    await engineeringButton.click();
    await page.waitForTimeout(2000); // Wait for filter to apply
    await page.screenshot({ path: 'step2-engineering-filter.png', fullPage: true });
    console.log('Screenshot 2 saved: step2-engineering-filter.png');
  } else {
    console.log('Engineering button not found!');
  }
  
  // Step 3: Click search icon
  console.log('\nStep 3: Clicking search icon...');
  const searchButton = await page.$('button[aria-label*="search" i], button[aria-label*="검색" i], button svg');
  if (searchButton) {
    await searchButton.click();
    await page.waitForTimeout(1000); // Wait for modal to open
    await page.screenshot({ path: 'step3-search-modal.png', fullPage: true });
    console.log('Screenshot 3 saved: step3-search-modal.png');
  } else {
    console.log('Search button not found! Trying alternative selector...');
    // Try clicking the last button in header
    const buttons = await page.$$('header button');
    if (buttons.length > 0) {
      await buttons[buttons.length - 1].click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'step3-search-modal.png', fullPage: true });
      console.log('Screenshot 3 saved: step3-search-modal.png');
    }
  }
  
  await browser.close();
  console.log('\nAll screenshots completed!');
})();
