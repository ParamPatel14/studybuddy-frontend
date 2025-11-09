// ✅ Disable static rendering to allow client hooks
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import RoadmapClient from './RoadmapClient';

export default function RoadmapPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-gray-500">
          Loading roadmap...
        </div>
      }
    >
      <RoadmapClient />
    </Suspense>
  );
}
