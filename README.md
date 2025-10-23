# 🧠 HabitFlow

Gestor de hábitos personales que ayuda a los usuarios a crear, seguir y mantener hábitos saludables mediante estadísticas visuales, recordatorios y seguimiento diario.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (via Prisma Postgres Accelerate recommended)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/santiagoarielv98/habitflow.git
   cd habitflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="your-postgresql-connection-string"
   
   # Better Auth
   BETTER_AUTH_SECRET="your-secret-key-here"
   BETTER_AUTH_URL="http://localhost:3000"
   ```

4. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

5. **Seed the database (optional)**
   
   First create an account via sign-up, then:
   ```bash
   npm run seed
   ```
   
   This will populate your account with sample habits and records from October 2025.
   See `prisma/SEED_README.md` for details.

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open the app**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

- **API Documentation**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs) (Swagger UI)
- **API Reference**: See `API_DOCUMENTATION.md`
- **Seed Data**: See `prisma/SEED_README.md`
- **Project Requirements**: See `.local/README.md`

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## 📊 Features

- ✅ User authentication (sign-up, sign-in, sign-out, change password)
- ✅ CRUD operations for habits
- ✅ Daily habit tracking with 30-day calendar view
- ✅ Statistics and visualizations (streaks, completion rates, charts)
- ✅ Habit editing and active/inactive toggle
- ✅ User profile with general statistics
- ✅ Dashboard filters (search, status, sorting)
- ✅ Complete API documentation with Swagger

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - App Router, Server/Client Components
- **React 19** - UI library
- **TailwindCSS** - Styling
- **shadcn/ui** - Component library
- **TanStack Query** - Data fetching and caching
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Recharts** - Data visualization
- **date-fns** - Date utilities

### Backend
- **Next.js API Routes** - RESTful API
- **Prisma** - ORM
- **PostgreSQL** - Database (via Prisma Postgres Accelerate)
- **Better Auth** - Authentication
- **Swagger** - API documentation

### Testing
- **Jest** - Test framework
- **React Testing Library** - Component testing

## 📁 Project Structure

```
habitflow/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── habits/          # Habits CRUD
│   │   └── records/         # Records CRUD
│   ├── dashboard/           # Dashboard page
│   ├── profile/             # User profile
│   └── api-docs/            # Swagger UI
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   └── __tests__/           # Component tests
├── hooks/                   # Custom React hooks
├── lib/                     # Utilities and configurations
│   ├── validations/         # Zod schemas
│   └── generated/prisma/    # Prisma client
├── prisma/                  # Database schema and migrations
└── __tests__/              # Test files
```

## 🔐 Authentication

HabitFlow uses [Better Auth](https://www.better-auth.com/) for authentication:
- Email/password authentication
- HTTP-only cookies for sessions
- Password change functionality
- Protected routes

## 🌱 Database Seeding

The seed script creates realistic sample data representing the development of HabitFlow during October 2025:

- 8 habits (coding, testing, documentation, exercise, etc.)
- 240 records (30 days × 8 habits)
- Detailed notes tracking project progress
- Varied completion patterns for realistic statistics

Run: `npm run seed` (after creating an account)

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
npm run seed         # Seed database with sample data
```

## 🚀 Deployment

This project is ready to deploy on [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables
4. Deploy

See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 📄 License

This project was created as a university assignment.

## 👨‍💻 Author

Santiago Ariel Vallone - [@santiagoarielv98](https://github.com/santiagoarielv98)

---

Built with ❤️ using Next.js 15, Prisma, and Better Auth
