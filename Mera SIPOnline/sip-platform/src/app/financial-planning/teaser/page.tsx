'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import TeaserDashboard from '@/components/financial-planning/TeaserDashboard';
import type { TeaserData } from '@/types/financial-planning';

const STORAGE_KEY = 'fp-teaser-data';

export default function TeaserPage() {
  const router = useRouter();
  const [teaserData, setTeaserData] = useState<TeaserData | null>(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        router.replace('/financial-planning');
        return;
      }

      const parsed = JSON.parse(stored);
      setTeaserData(parsed.teaser);
      setUserName(parsed.userName || '');
      setUserEmail(parsed.userEmail || '');
    } catch {
      router.replace('/financial-planning');
      return;
    }
    setLoading(false);
  }, [router]);

  if (loading || !teaserData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand mx-auto mb-3" />
          <p className="text-sm text-slate-500">Loading your results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-8 px-4">
      <TeaserDashboard data={teaserData} userName={userName} userEmail={userEmail} />
    </div>
  );
}
