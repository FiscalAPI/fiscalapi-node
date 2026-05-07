# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FiscalAPI SDK for Node.js - Official TypeScript SDK for Mexican electronic invoicing (CFDI 4.0) and fiscal services. Wraps the FiscalAPI REST API for invoice creation, payment complements, bulk XML downloads, and SAT catalog queries.

## Build Commands

```bash
npm run build          # Full build: clean + cjs + esm + package-json markers
npm run build:esm      # TypeScript → ES Modules (dist/esm), then fix-esm-imports.js adds .js extensions
npm run build:cjs      # TypeScript → CommonJS (dist/cjs)
npm run clean          # Remove dist directory
npm test               # Run Jest (note: jest not in devDependencies yet)
npm run lint           # ESLint on src/**/*.ts (note: eslint not in devDependencies yet)
npm run main           # Run examples/main.ts with ts-node
```

There is no `build:types` script — the full `build` script handles CJS + ESM + dual-package markers via `build:package-json` (creates `dist/cjs/package.json` with `"type":"commonjs"` and `dist/esm/package.json` with `"type":"module"`).

## Architecture

**Facade Pattern**: `FiscalapiClient` (`src/services/fiscalapi-client.ts`) is the single entry point.
- Static factory: `FiscalapiClient.create(settings)` — validates settings, sets defaults, creates one shared HTTP client
- Private constructor enforces factory usage
- Services exposed as readonly properties: `invoices`, `products`, `persons`, `taxFiles`, `catalogs`, `apiKeys`, `stamps`, `downloadCatalogs`, `downloadRules`, `downloadRequests`

**Service Layer**:
- `BaseFiscalapiService` provides CRUD: `list()`, `getById()`, `create()`, `update()`, `remove()`, `upload()`
- Specialized services add domain methods (e.g., `InvoiceService.cancel()`, `.getPdf()`, `.getXml()`, `.send()`, `.getStatus()`)
- `PersonService` contains nested `EmployeeService` and `EmployerService`

**HTTP Client** (`src/http/`):
- Axios-based with 30s timeout
- Factory caches clients by key `apiKey:tenant:apiUrl`
- Headers: `X-API-KEY`, `X-TENANT-KEY`, `X-TIMEZONE`
- Debug mode enables request/response logging via Axios interceptors and disables SSL certificate verification (`rejectUnauthorized: false`)

**Key Patterns**:
- All services implement interfaces from `src/abstractions/`
- `ApiResponse<T>` wraps all responses: `{ succeeded, data, message, details, httpStatusCode }`
- Dual-package output: ESM + CJS. Post-build script `scripts/fix-esm-imports.js` adds `.js` extensions to ESM imports for Node.js native module support
- Date handling uses Luxon with `America/Mexico_City` timezone; SAT format: `yyyy-MM-dd'T'HH:mm:ss`
- `src/index.ts` re-exports 100+ types — all public API surface

## Configuration

```typescript
const client = FiscalapiClient.create({
  apiUrl: "https://test.fiscalapi.com",  // or https://live.fiscalapi.com
  apiKey: "<api_key>",
  tenant: "<tenant>",
  apiVersion: "v4",                      // default
  timeZone: "America/Mexico_City",       // default
  debug: false                           // enables logging + disables SSL verification
});
```

## Two Operation Modes

1. **By References**: Send only IDs of pre-configured entities in FiscalAPI dashboard
2. **By Values**: Send complete data in each request (no prior setup needed)

Examples for both modes are in `examples/` (7 files covering invoices, payroll, local taxes, stamps, employee/employer data).

## TypeScript Configuration

Strict mode enabled. Target: **ES2019**. Key flags: `noImplicitAny`, `strictNullChecks`, `noImplicitReturns`, `noUnusedParameters`, `noFallthroughCasesInSwitch`. `noUnusedLocals` is **false**. Three tsconfig files: `tsconfig.base.json` (shared), `tsconfig.esm.json` (ESNext modules → dist/esm), `tsconfig.cjs.json` (CommonJS → dist/cjs).

## CI/CD

GitHub Actions (`.github/workflows/main.yml`): manual trigger only, builds on Node 18, publishes to npm. No tests run before publish.
