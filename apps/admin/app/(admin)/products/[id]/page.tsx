'use client';

import { use } from 'react';

type Props = { params: Promise<{ id: string }> };

export default function ProductEditPage({ params }: Props) {
  const { id } = use(params);
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-slate-900 mb-4">Edit Product</h1>
      <p className="text-slate-500 text-sm">Product ID: {id}</p>
      <p className="text-slate-400 text-sm mt-2">Full editor implemented in Phase 7.</p>
    </div>
  );
}
