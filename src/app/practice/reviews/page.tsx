// ✅ Force this page to render dynamically (no static export)
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import PracticeReviewsClient from './PracticeReviewsClient';

export default function PracticeReviewsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center text-gray-500">
          Loading Reviews...
        </div>
      }
    >
      <PracticeReviewsClient />
    </Suspense>
  );
}
