export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import PlacementDashboard from './PlacementDashboard';

export default function PlacementDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading dashboard...
      </div>
    }>
      <PlacementDashboard />
    </Suspense>
  );
}