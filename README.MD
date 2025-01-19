# **Image Upload Widget**

Robust image upload server using **Node.js**, **PostgreSQL**, and **Cloudflare R2** to uploading, listing, and exporting remote link to CSV format. The project utilizes **PostgreSQL cursors** and **Node.js streams** for efficient data handling. Also runs validation, error handling, testing, and CI workflow to be scalable and efficient.

## **Tech Stack** 🚀

#### **Core Dependencies** 🛠️

- **Fastify** ⚡: Ultra-fast and lightweight web framework - `fastify`
- **CORS Support** 🌍: Handle cross-origin resource sharing - `@fastify/cors`
- **Multipart Uploads** 📂: Simplify file uploads - `@fastify/multipart`
- **Swagger & UI** 📜✨: API documentation and UI generation - `@fastify/swagger`, `@fastify/swagger-ui`
- **PostgreSQL** 🐘: Database client for PostgreSQL - `postgres`
- **AWS SDK for S3** ☁️: Cloud storage integration - `@aws-sdk/client-s3`, `@aws-sdk/lib-storage`
- **UUID** 🔑: Generate unique identifiers - `uuidv7`
- **CSV Utilities** 📄: Create and manage CSV files - `csv-stringify`
- **Day.js** 📆: Handle and manipulate dates - `dayjs`
- **Validation** 🔍: Type-safe validation with Zod - `zod`, `fastify-type-provider-zod`

### **Developer Tools** 🧰

- **TypeScript** 🛡️: Strongly-typed JavaScript - `typescript`, `@types/node`
- **Drizzle ORM** 🌾: Type-safe and lightweight ORM - `drizzle-orm`, `drizzle-kit`
- **Environment Config** 🌱: Manage environment variables - `dotenv-cli`
- **Faker.js** 🎭: Generate fake data for testing - `@faker-js/faker`
- **Biome** 🌐: Code linter and formatter - `@biomejs/biome`
- **Testing** 🧪: Unit tests with Vitest - `vitest`
- **Build Tools** 🏗️: Bundling and development with `tsup` and `tsx`
- **Vite Plugins** ⚙️: TSConfig path support - `vite-tsconfig-paths`

## **Installation**

#### 1. Clone the repository:

```bash
git clone https://github.com/feliperocha93/upload-server.git
cd upload-server
```

#### 2. Install dependencies:

```bash
npm install
```

#### 3. Configure environment variables:

Create a .env file in the root directory and configure the following:

```bash
PORT=3333
NODE_ENV=development

# Database
DATABASE_URL="postgresql://docker:docker@localhost:5432/upload"

# Cloudfare
CLOUDFARE_ACCOUNT_ID="your-cloudflare-account-id"
CLOUDFARE_ACCESS_KEY_ID="your-cloudflare-access-key-id"
CLOUDFARE_SECRET_ACCESS_KEY="your-cloudflare-secret-access-key"
CLOUDFARE_BUCKET="your-bucket-name"
CLOUDFARE_PUBLIC_URL="your-cloudflare-public-url"
```

#### 4. Run the container:

```bash
npm docker compose up -d
```

#### 5. Run the database migrations:

```bash
npm run migrate
```

#### 6. Run the app:

```bash
npm run dev
```

## Testing

Run the test suite:

```bash
npm run test
```
