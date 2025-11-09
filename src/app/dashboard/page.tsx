// ✅ This file runs on the server
// Prevent static prerendering (which breaks useSearchParams)
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import DashboardClient from './DashboardClient';

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-gray-600">
          Loading dashboard...
        </div>
      }
    >
      <DashboardClient />
    </Suspense>
  );
}
