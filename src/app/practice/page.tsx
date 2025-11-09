// ✅ Force this page to render dynamically
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import PracticeClient from './PracticeClient';

export default function PracticePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center text-gray-500">
          Loading Practice Page...
        </div>
      }
    >
      <PracticeClient />
    </Suspense>
  );
}
