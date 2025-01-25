# AWS Next.js Starter Kit 🚀

A modern, production-ready starter template for building full-stack applications with Next.js and AWS, powered by SST (Serverless Stack). This template provides a solid foundation for building scalable web applications with best practices baked in.

## ✨ Features

- **Full-Stack Next.js**: Server and client components with App Router
- **AWS Infrastructure**: Powered by SST for easy AWS deployment
- **Authentication Ready**: Clerk integration for secure user management
- **Database Setup**: Drizzle ORM with Turso (SQLite)
- **Type Safety**: End-to-end type safety with TypeScript
- **Modern UI**: Built with Radix UI and Tailwind CSS
- **API Integration**: tRPC for type-safe API communication
- **Payment Processing**: Stripe integration ready
- **Background Jobs**: Inngest for scheduled tasks and queues

## 🎯 Example Implementation

This starter kit includes a real estate content generator as an example implementation to demonstrate how all the components work together in a real-world application. Here's how it showcases the integration of various features:

### Authentication Flow
- Clerk handles user registration and login
- Protected dashboard routes under `src/app/(dashboard)`
- Role-based access control for different subscription tiers

### Database & API Integration
- Turso database schema for storing user preferences and content
- tRPC routers demonstrate type-safe API endpoints
- Real-world examples of database queries and mutations

### Background Jobs
- Inngest functions for scheduled content generation
- Example of handling webhook events from Stripe
- Background processing patterns for AI content generation

### Payment Integration
- Stripe subscription management
- Webhook handling for subscription updates
- Usage-based billing implementation

### Frontend Patterns
- Dashboard layout with responsive design
- Form handling with validation
- Real-time updates using tRPC
- Protected API routes and middleware

This example implementation serves as a reference for:
- Organizing code in a scalable way
- Implementing authentication flows
- Setting up background jobs
- Managing subscriptions and payments
- Building type-safe APIs
- Creating protected routes

You can use this as a learning resource or replace it with your own application logic while keeping the same architectural patterns.

## 🛠️ Tech Stack

- **Frontend**: 
  - Next.js 14
  - TypeScript
  - Tailwind CSS
  - shadcn/ui Components
  - Radix UI Components
  - Framer Motion

- **Backend**:
  - tRPC
  - Clerk Authentication
  - Drizzle ORM
  - Turso (SQLite)

- **Infrastructure**:
  - SST (Serverless Stack)
  - AWS Lambda
  - AWS CloudFront
  - Inngest
  - Stripe

## 🚀 Getting Started

1. **Clone the repository**

```bash
git clone <repository-url>
cd aws-nextjs-starter-kit
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up external services**

### SST Setup
1. Install the AWS CLI and configure your credentials
2. Create an SST account at [sst.dev](https://sst.dev)
3. Follow the SST setup guide for your AWS account
4. Add your AWS credentials to your environment

### Turso Setup
1. Install the Turso CLI:
```bash
curl -sSfL https://get.tur.so/install.sh | bash
```
2. Create a new database:
```bash
turso db create your-db-name
turso db tokens create your-db-name
```
3. Add the database URL and token to your environment variables

### Clerk Setup
1. Create a new application at [clerk.dev](https://clerk.dev)
2. Configure your OAuth providers (Google, GitHub, etc.)
3. Add your Clerk keys to your environment variables:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

### Stripe Setup
1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Add your Stripe keys to your environment variables:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
4. Set up Stripe CLI for local webhook testing:
```bash
stripe listen --forward-to localhost:3000/api/stripe
```

### Inngest Setup
1. Create an account at [inngest.com](https://inngest.com)
2. Create a new project and get your keys
3. Add your Inngest keys to your environment variables:
   - `INNGEST_EVENT_KEY`
   - `INNGEST_SIGNING_KEY`
4. For local development:
```bash
npx inngest-cli@latest dev
```

4. **Set up environment variables**
```bash
cp .env.example .env.local
```

5. **Customize UI Components**

The starter kit uses shadcn/ui for beautiful, accessible components. You can customize the components by:
- Modifying the `components.json` configuration
- Adding or updating components using the shadcn/ui CLI
- Customizing component styles in the `src/components/ui` directory

```bash
# Add new shadcn/ui components
npx shadcn-ui@latest add [component-name]
```

6. **Start development**
```bash
pnpm sst dev
```

## 🔑 Environment Variables

Required environment variables:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk public key
- `CLERK_SECRET_KEY`: Clerk secret key
- `DATABASE_URL`: Turso database URL
- `DATABASE_TOKEN`: Turso database auth token
- `STRIPE_SECRET_KEY`: Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook secret
- `INNGEST_SIGNING_KEY`: Inngest signing key
- `INNGEST_EVENT_KEY`: Inngest event key

See `.env.example` for all required variables.

## 📦 Project Structure

```
.
├── src/
│   ├── app/              # Next.js App Router pages and layouts
│   │   ├── (auth)/      # Authentication routes
│   │   ├── (dashboard)/ # Protected dashboard routes
│   │   └── (marketing)/ # Public marketing pages
│   ├── components/      # Shared React components
│   │   ├── ui/         # UI components (buttons, cards, etc.)
│   │   └── shared/     # Shared components across routes
│   ├── db/             # Database schema and configurations
│   │   ├── migrations/ # Drizzle migrations
│   │   └── schema/     # Database schema definitions
│   ├── inngest/        # Background job definitions
│   ├── trpc/           # tRPC router and procedure definitions
│   ├── lib/            # Utility functions and shared logic
│   ├── fonts/          # Local font files
│   └── images/         # Static images and assets
├── public/             # Public static assets
├── sst.config.ts      # SST infrastructure configuration
├── drizzle.config.ts  # Drizzle ORM configuration
├── tailwind.config.ts # Tailwind CSS configuration
├── next.config.mjs    # Next.js configuration
└── package.json       # Project dependencies and scripts
```

## 🌟 Key Features

- Type-safe from database to frontend using TypeScript and tRPC
- Secure authentication and user management with Clerk
- Modern UI components with Radix UI and Tailwind
- Easy AWS deployment with SST
- Background job processing with Inngest
- Payment processing with Stripe

## 📝 Development Notes

- Run `pnpm sst dev` to start the development environment
- SST will deploy your infrastructure to AWS
- Local development uses SST's Live Lambda Development
- Use `pnpm build` to create a production build

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [SST Documentation](https://docs.sst.dev)
- [Clerk Documentation](https://clerk.com/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [Drizzle Documentation](https://orm.drizzle.team)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this starter kit for any project!