# Lore V2 Setup Guide

This guide provides comprehensive instructions for setting up the external infrastructure required to run the modernized Lore V2 application. It covers Supabase database configuration, environment variables, Vercel deployment, and Git repository management.

## 1. Supabase Setup

Lore V2 uses [Supabase](https://supabase.com/) as its backend, providing a PostgreSQL database, authentication, and real-time capabilities. Follow these steps to set up your Supabase project:

### 1.1 Create a New Supabase Project

1.  Go to the [Supabase Dashboard](https://app.supabase.com/) and log in or sign up.
2.  Click "New project" to create a new project.
3.  Choose an organization, provide a project name (e.g., `lore-v2`), set a strong database password, and select a region. Click "Create new project."

### 1.2 Apply Database Schema

Once your project is created, you need to set up the database tables, triggers, and Row Level Security (RLS) policies. I have generated a SQL script for this:

1.  In your Supabase project dashboard, navigate to the "SQL Editor" section.
2.  Click "New query" or open an existing one.
3.  Copy the entire content of the `supabase_schema.sql` file (provided in the updated repository) and paste it into the SQL editor.
4.  Click "Run" to execute the script. This will create the `lores`, `pages`, and `relationships` tables, along with their respective RLS policies and triggers for `page_count` and `contributor_count`.

### 1.3 Enable Authentication Providers

Lore V2 includes email/password authentication. You can enable additional providers (e.g., Google, GitHub) if desired:

1.  In your Supabase project dashboard, navigate to "Authentication" -> "Providers."
2.  Enable "Email" and configure its settings (e.g., email templates, confirmation links).
3.  Optionally, enable and configure any third-party OAuth providers you wish to support.

## 2. Environment Variables & Vercel Configuration

Your application needs to know how to connect to your Supabase project. This is done via environment variables.

### 2.1 Retrieve Supabase API Keys

1.  In your Supabase project dashboard, navigate to "Project Settings" -> "API."
2.  Locate your `Project URL` and `anon public` key. These correspond to `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` respectively.

### 2.2 Local `.env` File Setup

For local development, create a `.env` file in the root of your project (if it doesn't exist) and add your Supabase credentials. Refer to the `/.env.example` file for the correct format:

```
VITE_SUPABASE_URL="YOUR_SUPABASE_URL"
VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
```

**Important:** The `.gitignore` file has been updated to exclude `.env` from version control. **Never commit your `.env` file to a public repository.**

### 2.3 Vercel Environment Variables

When deploying to Vercel, you need to configure these environment variables in your Vercel project settings:

1.  Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Select your project.
3.  Navigate to "Settings" -> "Environment Variables."
4.  Add two new environment variables:
    *   `VITE_SUPABASE_URL`: Paste your Supabase Project URL.
    *   `VITE_SUPABASE_ANON_KEY`: Paste your Supabase anon public key.
5.  Ensure these variables are available for the appropriate environments (e.g., Production, Preview, Development).

## 3. Git & Deployment Instructions

This section guides you through setting up your Git repository and deploying your application to Vercel.

### 3.1 Initialize Git Repository

1.  Navigate to the root of your Lore V2 project directory in your terminal.
2.  Initialize a new Git repository:
    ```bash
    git init
    ```
3.  Add all files to the staging area:
    ```bash
    git add .
    ```
4.  Make your first commit:
    ```bash
    git commit -m "feat: Initial commit of modernized Lore V2 codebase"
    ```
5.  Create a new remote repository on your preferred platform (e.g., GitHub, GitLab, Bitbucket).
6.  Add the remote origin and push your code:
    ```bash
    git remote add origin <YOUR_REPOSITORY_URL>
    git push -u origin main
    ```

### 3.2 Deploy to Vercel

1.  Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click "Add New..." -> "Project."
3.  Import your Git repository (e.g., from GitHub).
4.  Vercel will automatically detect that it's a Vite project. Ensure the "Framework Preset" is set to "Vite."
5.  During the setup, ensure you have configured the environment variables as described in Section 2.3.
6.  Click "Deploy." Vercel will build and deploy your application.

Your Lore V2 application should now be live and connected to your Supabase backend!

## 4. Post-Deployment Steps

*   **Test Functionality:** Thoroughly test all features, including creating lores and pages, editing, searching, and especially the new authentication flow.
*   **Realtime Subscriptions:** While the database is set up for real-time, ensure your application logic correctly subscribes to changes for dynamic updates (e.g., on the Home page).
*   **Monitoring:** Utilize Vercel and Supabase dashboards for monitoring logs, performance, and any potential errors.

By following these steps, you will have a fully functional and modernized Lore V2 application deployed and ready for use. This structured approach helps you **explore the data more intuitively**, **understand trends better**, and **easily save or share** your project with others.
