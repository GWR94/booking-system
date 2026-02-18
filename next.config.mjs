/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	transpilePackages: ['@mui/x-date-pickers'],
	turbopack: {
		// Prisma 7 generated client uses .js in imports; use relative paths (Turbopack doesn't support Windows absolute paths)
		resolveAlias: {
			'./enums.js': './prisma/generated/enums.ts',
			'./internal/class.js': './prisma/generated/internal/class.ts',
			'./internal/prismaNamespace.js': './prisma/generated/internal/prismaNamespace.ts',
		},
	},
};

export default nextConfig;
