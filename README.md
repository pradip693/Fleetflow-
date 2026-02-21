# FleetFlow - Professional Fleet & Logistics Management

FleetFlow is a state-of-the-art fleet management system built with Next.js 15, optimized for performance and production readiness. It provides comprehensive tools for managing vehicles, drivers, trips, maintenance, and analytics.

## 🚀 Key Features

- **Predictive Analytics**: Data-driven ROI and performance insights with beautiful Recharts visualizations.
- **Currency Management**: Automatic USD to INR conversion (83x) with full localization (₹) across the board.
- **Asset Integrity**: Real-time status tracking for vehicles, drivers, and trips.
- **Maintenance Lifecycle**: Track service records, costs, and upcoming maintenance schedules.
- **Role-Based Access**: Specialized views for Managers, Dispatchers, and Analysts.

## ⚡ Performance Optimizations

- **Next.js Server Components**: Optimized data fetching architecture that fetches data on the server and hydrates client stores for instant interactivity and SEO.
- **Global Data Store**: Powered by Zustand for lightweight, reactive state management.
- **Premium UX**: Global loading splash screens and robust error boundaries for a smooth production experience.
- **Type Safety**: Fully typed codebase with TypeScript for maximum reliability.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + Shadcn UI
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React
- **API**: RESTful interface with JSON Server (Mock)

## 📦 Getting Started

1. **Environment Config**:
   Create a `.env` file (or use existing) and set your API URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Mock API**:
   ```bash
   npx json-server db.json --port 3001
   ```

4. **Launch Application**:
   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to access the dashboard.
