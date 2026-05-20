import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export default function setup() {
	try {
		const coverageTmp = join(process.cwd(), 'coverage', '.tmp');
		if (!existsSync(coverageTmp)) {
			mkdirSync(coverageTmp, { recursive: true });
		}
	} catch {
		/* ignore */
	}
}
