# 🔌 Integrations App

A full-stack application built with **Next.js**, **Supabase**, **TailwindCSS + DaisyUI**, and **OpenAI**. Users can create, manage, and explore API integrations — with AI-generated metadata suggestions and filtering capabilities.

---

## ✨ Features

- 🔐 **Authentication** via Supabase (email & password)
- 🧠 **AI integration name suggestions** using OpenAI
- 📦 **Integration metadata generation** with config preview
- 🔍 **Filter + search integrations** by type, supplier, date
- 🧑 **User profiles** (username & email)
- 🎨 **Fully responsive layout** with sidebar navigation
- 📱 **Mobile-friendly** with drawer-based sidebar

---

## ⚙️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org)
- **Database & Auth:** [Supabase](https://supabase.com)
- **AI:** [OpenAI API](https://platform.openai.com/)
- **Styling:** [TailwindCSS](https://tailwindcss.com) + [DaisyUI](https://daisyui.com)
- **ORM:** SQL (via Supabase interface)

---

## 💡 Design Decisions

- Used **Supabase** for auth + DB to avoid needing a custom backend.
- All metadata generation is powered by **OpenAI** and stored in Supabase.
- Mobile-first responsive design with **Tailwind + DaisyUI**.

---

## 🧠 Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Supabase account](https://supabase.com)
- [OpenAI API key](https://platform.openai.com/account/api-keys)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/integrations-app.git
cd integrations-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env.local` file

At the root of the project, create a file named `.env.local` and add the following:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key

These values can be found in your Supabase Project Settings → API.
go to (https://platform.openai.com/api-keys) to generate an OPENAI key
```



### 4. Run the development server

```bash
npm run dev
```

Visit: [http://localhost:3000]

---

## 🛠 Supabase Setup

### 🔸 Create Required Tables

In your Supabase SQL editor, run:

```sql
-- Profiles table (automatically created with auth)

create table if not exists profiles (
  id uuid primary key references auth.users(id),
  username text
);

-- Integrations table
create table if not exists integrations (
  id uuid primary key default gen_random_uuid(),
  name text,
  description text,
  api_docs_url text,
  config_example text,
  integration_type text,
  ease_of_implementation text,
  popularity text,
  author text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);
```

### 🔸 Enable Row-Level Security (RLS)

Make sure RLS is enabled on both tables. Then run:

```sql
-- Allow users to select/update their own profile
create policy "Allow user access to own profile"
on profiles for all
using (auth.uid() = id);

-- Allow inserting & selecting integrations owned by the user
create policy "Allow integration owner access"
on integrations for all
using (author = auth.email());
```

---

## 🔐 Auth Setup

- Ensure **Email Auth** is enabled in Supabase Auth → Settings.

---

## 🤖 OpenAI API

You'll need an **OpenAI API key** (https://platform.openai.com/api-keys). This is used to:

- Generate metadata for a given integration name
- Suggest possible future integrations based on your recent ones

---

## 🧪 Testing It Out

1. **Create a user** (signup page)
2. **auth with gmail**
3. **Log in**
4. Go to **Create Integration**
5. Type an integration name like "Stripe" and click **Generate with AI**
6. **Save** the integration
7. Go to **All Integrations** to view it
8. Click on it to **view/edit details**

