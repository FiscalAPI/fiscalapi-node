# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FiscalAPI SDK for Node.js - Official TypeScript SDK for Mexican electronic invoicing (CFDI 4.0) and fiscal services. Wraps the FiscalAPI REST API for invoice creation, payment complements, bulk XML downloads, and SAT catalog queries.

## Build Commands

```bash
npm run build          # Full build: clean + esm + cjs + types
npm run build:esm      # TypeScript to ES Modules (dist/esm)
npm run build:cjs      # TypeScript to CommonJS (dist/cjs)
npm run build:types    # TypeScript declaration files (dist/types)
npm run clean          # Remove dist directory
npm test               # Run Jest tests
npm run lint           # ESLint on src/**/*.ts
npm run main           # Run examples/main.ts with ts-node
```

## Architecture

**Facade Pattern**: `FiscalapiClient` is the main entry point exposing all services:
- `invoices` - CFDI invoice creation, cancellation, PDF generation
- `products` - Product/service catalog management
- `persons` - Issuer/recipient (emisor/receptor) management
- `taxFiles` - CSD certificate upload
- `catalogs` - SAT catalog queries
- `downloadCatalogs`, `downloadRules`, `downloadRequests` - Bulk XML download

**Directory Structure**:
- `src/abstractions/` - Service interfaces (I*Service)
- `src/services/` - Service implementations extending `BaseFiscalapiService`
- `src/models/` - Data models (Invoice, Person, Product, etc.)
- `src/common/` - Shared DTOs (ApiResponse, PagedList, FiscalapiSettings)
- `src/utils/` - Date formatting (Luxon), Base64 encoding, validation helpers

**Key Patterns**:
- All services implement interfaces from `abstractions/`
- HTTP client injected via factory pattern
- Dual-package output: ESM + CommonJS + TypeScript declarations
- Date handling uses Luxon with `America/Mexico_City` timezone
- SAT date format: `yyyy-MM-ddTHH:mm:ss`

## Configuration

```typescript
const settings: FiscalapiSettings = {
  apiUrl: "https://test.fiscalapi.com",  // or https://live.fiscalapi.com
  apiKey: "<api_key>",
  tenant: "<tenant>",
  apiVersion?: "v4",                      // default
  timeZone?: "America/Mexico_City",       // default
  debug?: false
};
const client = FiscalapiClient.create(settings);
```

## Two Operation Modes

1. **By References**: Send only IDs of pre-configured entities in FiscalAPI dashboard
2. **By Values**: Send complete data in each request (no prior setup needed)

## TypeScript Configuration

Strict mode enabled with all checks: `noImplicitAny`, `strictNullChecks`, `noImplicitReturns`, `noUnusedParameters`. Target ES2018.
