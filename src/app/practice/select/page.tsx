// ✅ Force dynamic rendering to avoid static pre-render crash
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import PracticeSelectClient from './PracticeSelectClient';

export default function PracticeSelectPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center text-gray-500">
          Loading Selection Page...
        </div>
      }
    >
      <PracticeSelectClient />
    </Suspense>
  );
}
