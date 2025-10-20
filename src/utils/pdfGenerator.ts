import * as ejs from 'ejs';
import puppeteer from 'puppeteer';
import * as path from 'path';
import * as fs from 'fs';

export const htmlToPdfBuffer = async (
  templatePath: string,
  data: any,
  pdfOptions = {},
): Promise<Buffer | null> => {
  let browser;
  try {
    // Check if file exists
    const absolutePath = path.resolve(templatePath);
    
    if (!fs.existsSync(absolutePath)) {
      console.error('Template file does not exist:', absolutePath);
      return null;
    }

    // Render EJS template
    const html = await ejs.renderFile(absolutePath, data);

    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      timeout: 60000,
    });

    const page = await browser.newPage();
    await page.emulateMediaType('print');

    await page.setContent(html, {
      waitUntil: 'networkidle0',
      timeout: 60000,
    });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: false,
      timeout: 120000,
      ...pdfOptions,
    });

    return pdfBuffer;
  } catch (error) {
    console.error('Error in htmlToPdfBuffer:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
    });
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};