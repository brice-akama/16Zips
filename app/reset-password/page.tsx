'use client';

export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import ResetPasswordPageInner from './ResetPasswordPageInner';

export default function ResetPasswordPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPageInner />
    </Suspense>
  );
}
