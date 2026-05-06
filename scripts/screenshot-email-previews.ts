import path from 'path';
import { mkdir, readdir } from 'fs/promises';
import { chromium } from '@playwright/test';

const root = process.cwd();
const previewsDir = path.resolve(root, 'email-previews');
const screenshotsDir = path.resolve(previewsDir, 'screenshots');

const main = async () => {
	await mkdir(screenshotsDir, { recursive: true });

	const files = await readdir(previewsDir);
	const htmlFiles = files.filter((file) => file.endsWith('.html')).sort();

	if (htmlFiles.length === 0) {
		throw new Error(
			`No HTML previews found in ${previewsDir}. Run "npm run emails:preview" first.`,
		);
	}

	const browser = await chromium.launch({ headless: true });
	const page = await browser.newPage({
		viewport: { width: 1200, height: 1800 },
	});

	for (const htmlFile of htmlFiles) {
		const sourcePath = path.resolve(previewsDir, htmlFile);
		await page.goto(`file://${sourcePath}`, { waitUntil: 'networkidle' });
		await page.screenshot({
			path: path.resolve(screenshotsDir, htmlFile.replace('.html', '.png')),
			fullPage: true,
		});
	}

	await browser.close();
	console.log(`Saved ${htmlFiles.length} screenshots to ${screenshotsDir}`);
};

main().catch((error) => {
	console.error('Failed to snapshot email previews', error);
	process.exit(1);
});

