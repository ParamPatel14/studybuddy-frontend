// ✅ Disable static prerendering to allow runtime-only hooks
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import PracticeClient from './PracticeClient';

export default function PracticePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-gray-500">
          Loading practice session...
        </div>
      }
    >
      <PracticeClient />
    </Suspense>
  );
}
