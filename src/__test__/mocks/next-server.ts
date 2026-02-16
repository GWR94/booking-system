// Mock Next.js server modules for Vitest
// Only exports what's actually imported in the codebase
export const NextResponse = {
	json: (data: any, init?: ResponseInit) =>
		new Response(JSON.stringify(data), {
			...init,
			headers: { 'Content-Type': 'application/json', ...init?.headers },
		}),
	redirect: (url: string, status?: number) =>
		new Response(null, { status: status || 302, headers: { Location: url } }),
	next: () => new Response(null, { status: 200 }),
};

export class NextRequest extends Request {
	public nextUrl: URL;

	constructor(input: RequestInfo | URL, init?: RequestInit) {
		super(input, init);
		// Create nextUrl from the input
		const url =
			typeof input === 'string'
				? input
				: input instanceof Request
					? input.url
					: input.toString();
		this.nextUrl = new URL(url);
	}
}
