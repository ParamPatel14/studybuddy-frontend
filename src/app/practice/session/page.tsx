// ✅ Force dynamic rendering so build doesn’t crash
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import PracticeSessionClient from './PracticeSessionClient';

export default function PracticeSessionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center text-gray-500">
          Loading practice session...
        </div>
      }
    >
      <PracticeSessionClient />
    </Suspense>
  );
}
