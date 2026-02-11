# Textura Backend - Modern CMS Core

A sophisticated, secure, and SEO-optimized backend for the Textura CMS, built with Node.js, TypeScript, and MongoDB.

## 🏗 Architecture Overview

The system follows a **Monolithic Service Architecture** designed for high throughput and rapid content delivery. It integrates the following layers:
- **API Layer**: Express.js REST endpoints with centralized error handling.
- **Validation Layer**: Type-safe input validation using **Zod**.
- **Security Layer**: JWT-based authentication, Role-Based Access Control (RBAC), and XSS sanitization via **DOMPurify**.
- **Data Layer**: ODM-driven interaction with MongoDB using **Mongoose**, featuring automated timestamps and schema-level uniqueness.

## 📂 Folder Structure

```text
src/
├── database/           # Mongoose schemas and model definitions
│   └── model.ts        # User, Blog, and Slider models
├── middleware/         # Custom Express middlewares
│   └── auth.ts         # JWT verification and RBAC (Admin/User)
└── index.ts            # Entry point: Server config, DB connection, and API routes
dist/                   # Compiled JavaScript output (Production ready)
tsconfig.json           # TypeScript configuration for NodeNext module resolution
```

## 🚀 SEO Strategy

Content is king, but discoverability is queen. Our SEO strategy focuses on:
- **Slug-Based Routing**: Clean, human-readable URLs (e.g., `/api/blogs/mastering-markdown`) instead of ID-based lookups.
- **Metadata Management**: Dedicated fields for `metaTitle` and `metaDescription` within the Blog engine to optimize SERP previews.
- **Performance**: Lean JSON responses and indexed MongoDB queries for minimal latency, influencing Core Web Vitals.
- **Timestamping**: Automated `updatedAt` fields to signal fresh content to search engine crawlers.

## ⚖️ Trade-offs Made

- **Monolithic vs. Microservices**: Chose a monolith for simplicity and faster developer velocity during the early stage. The structure is modular enough to split if scaling requires it.
- **Any-Casting in Models**: Used `(Model as any)` in specific API parts to resolve complex Type mismatches between Mongoose 9.x and TypeScript `nodenext`. This prioritizes stable runtime execution over perfect Type-orthodoxy in the short term.
- **In-Memory Sanitization**: Sanitization happens at the application level during write operations. This ensures DB-stored data is already safe, though it adds a slight overhead to `POST/PUT` requests.

## 🛠 Planned Improvements

Given more time, the following enhancements would be prioritized:
1. **Dynamic Image Optimization**: Integration with Cloudinary or AWS S3 for automated image resizing and WebP conversion.
2. **Refresh Token Rotation**: Enhancing security by moving from simple JWTs to a system with short-lived access tokens and secure HTTP-only refresh tokens.
3. **Advanced Caching**: Implementing Redis caching for public GET requests (like Sliders and Blog lists) to reduce DB load.
4. **Global Error Middleware**: Moving inline try-catch blocks to a centralized global error handling middleware for cleaner controller logic.
5. **Swagger/OpenAPI Documentation**: Automated documentation generation for the REST API.

---

**Developed by Deepesh Singh Rathore**
