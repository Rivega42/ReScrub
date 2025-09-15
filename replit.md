# ResCrub - Russian Data Protection Platform

## Overview

ResCrub is a Russian data protection platform that helps users safeguard their personal data in accordance with Federal Law 152-FZ. The platform automatically discovers and removes personal information from data broker websites, providing continuous monitoring and compliance with Russian data protection regulations. Built with a modern full-stack architecture using React, Express, and PostgreSQL, the platform focuses on professional design, security, and Russian localization.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side is built with React 18 and TypeScript, utilizing modern development patterns:
- **UI Framework**: Uses shadcn/ui components with Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom design system inspired by Cal.com
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation schemas
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
The server follows a REST API architecture with Express.js:
- **Framework**: Express.js with TypeScript for type safety
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Replit-based OAuth integration with session management
- **Session Storage**: PostgreSQL-based session storage using connect-pg-simple
- **API Design**: RESTful endpoints with consistent error handling and logging

### Database Schema
Uses Drizzle ORM with PostgreSQL, featuring:
- **Users Table**: Stores user profiles with OAuth integration fields
- **Sessions Table**: Manages user authentication sessions
- **Schema Validation**: Zod schemas for runtime type checking
- **Migrations**: Drizzle-kit for database schema management

### Design System
Follows Cal.com-inspired design principles with Russian localization:
- **Typography**: Inter font family for professional appearance
- **Color Palette**: Modern blue primary colors with dark/light theme support
- **Components**: Custom shadcn/ui components with hover/active states
- **Responsiveness**: Mobile-first design with Tailwind breakpoints
- **Accessibility**: ARIA-compliant components via Radix UI

### Authentication & Authorization
Implements secure authentication with:
- **OAuth Provider**: Replit OAuth for seamless integration
- **Session Management**: Secure session handling with PostgreSQL storage
- **Route Protection**: Middleware-based authentication checks
- **User Context**: React context for authentication state management

### Development Environment
Configured for Replit deployment with:
- **Development Server**: Vite dev server with HMR
- **Production Build**: Optimized static assets with Express serving
- **Environment Variables**: Database URL and OAuth configuration
- **TypeScript**: Full type safety across frontend and backend

## External Dependencies

### Database & ORM
- **Neon Database**: Serverless PostgreSQL database hosting
- **Drizzle ORM**: Type-safe database operations and migrations
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### UI & Styling
- **shadcn/ui**: Pre-built accessible React components
- **Radix UI**: Unstyled, accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Lucide React**: Consistent icon library
- **class-variance-authority**: Component variant management

### Authentication & Security
- **Replit OAuth**: Authentication service integration
- **OpenID Client**: OAuth/OpenID Connect implementation
- **Passport.js**: Authentication middleware for Express
- **express-session**: Session management middleware

### Development & Build Tools
- **Vite**: Fast build tool with TypeScript support
- **TypeScript**: Static type checking across the application
- **React Hook Form**: Form state management with validation
- **Zod**: Runtime schema validation and type inference
- **TanStack Query**: Server state management and caching

### Asset Management
- **Generated Images**: Custom illustrations stored in attached_assets
- **Google Fonts**: Inter font family for typography
- **PostCSS**: CSS processing with Tailwind and Autoprefixer

## Recent Changes

- **2024-09-15**: ✅ **COMPLETED: Production-Ready Email Authentication System**
  - Comprehensive email-based auth: registration, login, email verification, logout
  - Enterprise-grade security: hashed tokens, rate limiting, CSRF protection, helmet headers
  - Secure logging: sensitive data redaction, production token protection
  - Complete auth flow: AuthContext, protected routes (/app/*), verification page
  - Database schema: userAccounts, userProfiles, phoneVerifications tables
  - Security audit: PASSED architect review, all critical vulnerabilities fixed
- **2024-09-15**: Completed final 3 support pages: Whitepaper, System Status, and Blog
- **2024-09-15**: Implemented comprehensive database schema expansion with 7 new tables
- **2024-09-15**: Created production-ready security hardening and user-facing authentication UI