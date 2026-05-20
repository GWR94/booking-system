import type { Mock } from 'vitest';

export type VitestNextRouterMocks = {
	push: Mock;
	replace: Mock;
};

export function getVitestNextRouterMocks(): VitestNextRouterMocks {
	const g = globalThis as typeof globalThis & {
		__vitestNextRouter?: VitestNextRouterMocks;
	};
	if (!g.__vitestNextRouter) {
		throw new Error(
			'Vitest next/router mocks missing; ensure setupTests assigns __vitestNextRouter',
		);
	}
	return g.__vitestNextRouter;
}
