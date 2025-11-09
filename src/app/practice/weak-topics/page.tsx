// ✅ Force dynamic rendering so build doesn’t crash
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import WeakTopicsClient from './WeakTopicsClient';

export default function WeakTopicsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center text-gray-500">
          Loading weak topics...
        </div>
      }
    >
      <WeakTopicsClient />
    </Suspense>
  );
}
