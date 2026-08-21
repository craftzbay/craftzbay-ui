// Minimal ambient declaration so `process.env.NODE_ENV` dev-only guards type-check
// without pulling in @types/node. Bundlers replace the expression at build time.
declare const process: { env: { NODE_ENV?: string } };
