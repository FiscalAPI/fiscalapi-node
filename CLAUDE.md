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
- Services exposed as readonly properties: `invoices`, `products`, `persons`, `taxFiles`, `catalogs`, `apiKeys`, `stamps`, `downloadCatalogs`, `downloadRules`, `downloadRequests`, `manifests`, `satValidations`

**Service Layer**:
- `BaseFiscalapiService` provides CRUD: `getList(pageNumber, pageSize)`, `getById(id, details?)`, `create()`, `update()`, `delete()`, `search()`, plus `executeRequest()` for custom calls. There is no `upload()`: file uploads are base64 fields on the payload (e.g. `TaxFile.base64File`)
- Not every service extends the base class. Read-only resources whose shape does not fit `IFiscalapiService` are standalone: `DownloadCatalogService` (unpaged `getList()`) and `SatValidationService` (plain arrays, no CRUD). Their interfaces do not extend `IFiscalapiService`
- Specialized services add domain methods (e.g., `InvoiceService.cancel()`, `.getPdf()`, `.getXml()`, `.send()`, `.getStatus()`)
- `PersonService` contains nested `EmployeeService` and `EmployerService`

**HTTP Client** (`src/http/`):
- Axios-based with 30s timeout
- Factory caches clients by key `apiKey:tenant:apiUrl:timeZone:apiVersion` — all five matter because they are baked into the Axios instance
- Headers: `X-API-KEY`, `X-TENANT-KEY`, `X-TIME-ZONE` (the backend reads exactly `X-TIME-ZONE`; a different spelling is silently ignored and the user's timezone is lost)
- Debug mode enables request/response logging via Axios interceptors and disables SSL certificate verification (`rejectUnauthorized: false`)

**Key Patterns**:
- All services implement interfaces from `src/abstractions/`
- `ApiResponse<T>` wraps all responses: `{ succeeded, data, message, details, httpStatusCode, traceIdentifier? }` (`traceIdentifier` only comes back on errors). Errors never throw: HTTP failures are returned as `succeeded: false`
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

Examples for both modes are in `examples/` (invoices, payroll, local taxes, carta porte, comercio exterior, stamps, SAT validations, manifests, employee/employer data). Examples are executable documentation and the only test net: every variable is declared with its exported SDK type — no `any`, `unknown`, anonymous object literals or `as` assertions — so a contract drift breaks the build.

## TypeScript Configuration

Strict mode enabled. Target: **ES2019**. Key flags: `noImplicitAny`, `strictNullChecks`, `noImplicitReturns`, `noUnusedParameters`, `noFallthroughCasesInSwitch`. `noUnusedLocals` is **false**. Three tsconfig files: `tsconfig.base.json` (shared), `tsconfig.esm.json` (ESNext modules → dist/esm), `tsconfig.cjs.json` (CommonJS → dist/cjs).

## CI/CD

GitHub Actions (`.github/workflows/main.yml`): manual trigger only, builds on Node 18, publishes to npm. No tests run before publish.
