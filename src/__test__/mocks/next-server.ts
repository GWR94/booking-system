export class NextRequest extends Request {
	nextUrl: URL;

	constructor(input: string | URL | Request, init?: RequestInit) {
		const url =
			typeof input === 'string' || input instanceof URL
				? input.toString()
				: input.url;
		super(input as any, init);
		this.nextUrl = new URL(url);
	}
}

export class NextResponse extends Response {
	static json(body: unknown, init?: ResponseInit) {
		const json = JSON.stringify(body);
		const headers = new Headers(init?.headers);
		if (!headers.has('Content-Type')) {
			headers.set('Content-Type', 'application/json');
		}
		return new NextResponse(json, { ...init, headers });
	}
}

export const headers = () => new Headers();

export const cookies = {
	get: (_name: string) => undefined as unknown,
	set: (_name: string, _value: string, _options?: unknown) => {
		// no-op in tests
	},
	delete: (_name: string, _options?: unknown) => {
		// no-op in tests
	},
};

export const after = (fn: () => void | Promise<unknown>) => {
	const result = fn();
	if (result instanceof Promise) {
		return result;
	}
	return undefined;
};

