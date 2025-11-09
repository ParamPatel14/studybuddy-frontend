// ✅ Server component wrapper
// Disable prerendering so useSearchParams works
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import ExamDayClient from './ExamDayClient';

export default function ExamDayPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-gray-600">
          Loading exam day dashboard...
        </div>
      }
    >
      <ExamDayClient />
    </Suspense>
  );
}
