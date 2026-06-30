# Agent Context Guide

## Overview

This document provides context and guidelines for agents working on the RGA (Return on Ad Spend) Dashboard project. It helps ensure consistency, understanding of project structure, and efficient collaboration.

## Project Structure

### Root Level

- **backend/** - NestJS backend service (API, database sync, integrations)
- **frontend/** - React/TypeScript frontend application (Dashboard UI)
- **prisma/** - Database schemas and migrations
- **scripts/** - Utility scripts for deployment and maintenance
- **docs/** - Project documentation and audit reports

### Backend (`backend/`)

- **src/** - Main source code
  - `modules/` - Feature modules (auth, users, integrations, metrics)
  - `services/` - Business logic services
  - `controllers/` - API endpoints
  - `strategies/` - Authentication strategies
- **prisma/** - Database ORM configuration
- **test/** - Unit and integration tests
- **Dockerfile** - Backend containerization

### Frontend (`frontend/`)

- **src/** - React components and pages
  - `components/` - Reusable UI components
  - `pages/` - Main application pages
  - `services/` - API client services
  - `hooks/` - Custom React hooks
  - `utils/` - Utility functions
- **Dockerfile** - Frontend containerization
- **playwright.config.ts** - E2E testing configuration

## Key Technologies

### Backend Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Google OAuth 2.0, JWT
- **External APIs**: Google Ads API, Google Analytics 4, Google Search Console

### Frontend Stack

- **Framework**: React
- **Language**: TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui or custom components
- **Testing**: Playwright for E2E tests

## Important Modules & Services

### Authentication & Authorization

- OAuth 2.0 integration with Google
- JWT-based session management
- Role-based access control (RBAC)
- Multi-tenant support

### Data Integration

- **Google Ads**: Customer list, campaign metrics, performance data
- **Google Analytics 4**: Traffic, user behavior, conversion data
- **Google Search Console**: Search queries, impressions, CTR data

### Core Features

- Dashboard overview with key metrics
- Campaign performance analytics
- Spend tracking and ROI calculation
- Historical data comparison
- Data export and reporting

## Development Workflows

### Setup

1. Install dependencies: `npm install` (backend) and `npm install` (frontend)
2. Configure environment variables (`.env` files)
3. Set up database: `npm run prisma:migrate`
4. Start development servers

### Common Tasks

- **Backend Development**: `npm run start:dev` in backend/
- **Frontend Development**: `npm run dev` in frontend/
- **Database Migrations**: `npm run prisma:migrate dev`
- **Testing**: `npm run test` or `npm run test:e2e`
- **Build**: `npm run build` in respective directories

### Database

- ORM: Prisma
- Schema file: `backend/prisma/schema.prisma`
- Migrations: `backend/prisma/migrations/`
- Check schema: `backend/prisma.config.ts`

## Code Style & Conventions

- **Language**: TypeScript (strict mode)
- **Formatting**: Prettier
- **Linting**: ESLint
- **Naming**: camelCase for variables/functions, PascalCase for classes/components
- **File Structure**: Feature-based organization

## Common Issues & Solutions

### Google API Authentication

- Verify OAuth credentials in environment variables
- Check token refresh mechanisms
- Test with `backend/debug_ads_oauth*.ts` scripts

### Database Connectivity

- Connection string in `.env`
- Check Prisma schema alignment
- Use migration tools for schema changes

### Data Sync Issues

- Review sync logs in `backend/scripts/`
- Use diagnostic scripts: `backend/test-google-ads-diagnostics.js`
- Check API quota usage

## Important Files & Locations

| Purpose           | Location                                      |
| ----------------- | --------------------------------------------- |
| Environment Setup | DEVELOPMENT_GUIDE.md, SUPABASE_SETUP_GUIDE.md |
| Database Schema   | backend/prisma/schema.prisma                  |
| Google Ads Setup  | GOOGLE_ADS_METRICS_FIX_GUIDE.md               |
| GSC Configuration | GSC_PROJECT_DOCUMENTATION.md                  |
| Project Overview  | PROJECT_OVERVIEW.md                           |
| Testing Plan      | docs/MANUAL_TEST_PLAN.md                      |

## Testing & Quality

### Unit Tests

- Located in `backend/test/` and `frontend/test/`
- Run: `npm run test`

### Integration Tests

- API integration tests in backend
- Database transaction tests

### E2E Tests

- Playwright configuration: `frontend/playwright.config.ts`
- Run: `npm run test:e2e`

### Code Quality

- Audit reports: `docs/AUDIT_MASTER_REPORT.md`
- Health checks: `docs/CODEBASE_HEALTH_REPORT.md`

## Performance & Optimization

### Backend

- Query optimization with Prisma
- Caching strategies for API responses
- Batch processing for large data syncs

### Frontend

- Code splitting and lazy loading
- Image optimization
- Bundle size monitoring

## Deployment

### Docker

- Backend Dockerfile: `backend/Dockerfile`
- Frontend Dockerfile: `frontend/Dockerfile`
- Compose file: `docker-compose.yml`

### Build Scripts

- `build-and-package.bat` - Complete build process
- Backend: `backend/build.bat`
- Frontend: `frontend/build` command

## Contribution Guidelines

1. Create feature branches from main
2. Follow code style conventions
3. Write tests for new features
4. Update documentation
5. Submit PR with clear description
6. Address code review comments

## Support Resources

- **Architecture**: See PROJECT_OVERVIEW.md
- **API Contracts**: INTEGRATION_API_SPEC.md
- **Authentication**: AUTH_INTERFACE_CONTRACT.md
- **Debugging**: Various test and debug scripts in backend/
- **Postman Collection**: verification_postman_collection.json

---

**Last Updated**: June 2026
**Project**: RGA Dashboard - Multi-Platform Marketing Analytics
