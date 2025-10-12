# Next.js Supabase Dashboard

A modern, responsive dashboard built with Next.js 14, Supabase, and Tailwind CSS. This application provides a comprehensive interface for managing distributors, retailers, inventory, and analytics.

![Dashboard Preview](https://github.com/Chensokheng/next-supabase-dashboard/assets/52232579/8ffea2ac-0200-4bed-b87c-77d162d07b9e)

## 🚀 Features

- **Modern UI/UX** - Clean, responsive design with dark mode support
- **Authentication** - Secure user authentication with Supabase Auth
- **Dashboard** - Overview with key metrics and analytics
- **Retailer Management** - Manage retailers and their details
- **Inventory Tracking** - Track products and stock levels
- **Analytics** - Visualize data with interactive charts
- **Role-Based Access** - Different views based on user roles
- **Responsive Design** - Works on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui components
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Form Handling**: React Hook Form
- **Date Handling**: date-fns

## 📦 Prerequisites

- Node.js 18+ and npm 9+
- Supabase account
- Git

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Naveenmeh02/next-supabase-dashboard.git
   cd next-supabase-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.sample` to `.env.local`
   - Fill in your Supabase credentials
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in your browser**
   - Visit [http://localhost:3000](http://localhost:3000)

## 📂 Project Structure

```
/
├── app/                    # App router pages and layouts
│   ├── dashboard/         # Dashboard routes
│   │   ├── analytics/     # Analytics page
│   │   ├── inventory/     # Inventory management
│   │   ├── retailers/     # Retailer management
│   │   └── settings/      # User settings
│   └── auth/              # Authentication routes
│
├── components/            # Reusable UI components
│   ├── ui/                # Shadcn/ui components
│   └── ...
│
├── lib/                   # Utility functions and configurations
│   ├── supabase/          # Supabase client setup
│   └── actions/           # Server actions
│
└── public/                # Static assets
```

## 🔒 Authentication

The app uses Supabase Auth for authentication. Supported methods:
- Email/Password
- Magic Link
- Social Logins (if configured in Supabase)

## 📊 Database Schema

Key tables in the Supabase database:

### Users
```sql
create table users (
  id uuid references auth.users primary key,
  email text,
  role text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### Retailers
```sql
create table retailers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text,
  phone text,
  address jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

### Inventory
```sql
create table inventory (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  price numeric(10,2),
  quantity integer,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/ui Documentation](https://ui.shadcn.com/)

## 📄 Detailed Documentation

For more detailed documentation, please refer to [DISTRIBUTOR_DASHBOARD_GUIDE.md](DISTRIBUTOR_DASHBOARD_GUIDE.md) in the project root.
