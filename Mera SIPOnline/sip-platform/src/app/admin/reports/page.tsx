'use client';

import { useState, useEffect, useCallback } from 'react';
import { FileCheck, Clock, CheckCircle2, XCircle, Send, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { ReportQueueTable } from '@/components/admin/ReportQueueTable';
import type { ReportQueueEntry } from '@/types/report-queue';

interface StatsCard {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportQueueEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/reports');
      const data = await res.json();
      if (data.reports) setReports(data.reports);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const stats: StatsCard[] = [
    {
      label: 'Total Reports',
      value: reports.length,
      icon: FileCheck,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      label: 'Pending Review',
      value: reports.filter((r) => r.status === 'pending_review').length,
      icon: Clock,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      label: 'Sent',
      value: reports.filter((r) => r.status === 'sent').length,
      icon: Send,
      color: 'text-green-600 bg-green-50',
    },
    {
      label: 'Rejected',
      value: reports.filter((r) => r.status === 'rejected').length,
      icon: XCircle,
      color: 'text-red-600 bg-red-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-primary-700">Financial Reports</h1>
          <p className="text-sm text-slate-500">Review, approve, and manage financial health reports</p>
        </div>
        <button
          onClick={fetchReports}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 bg-white border border-surface-200 rounded-xl hover:bg-surface-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={cn('w-3.5 h-3.5', loading && 'animate-spin')} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card-base p-5">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', stat.color)}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-extrabold text-primary-700">{stat.value}</div>
            <div className="text-xs text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Reports Table */}
      {loading && reports.length === 0 ? (
        <div className="card-base p-12 text-center">
          <div className="animate-pulse text-sm text-slate-400">Loading reports...</div>
        </div>
      ) : (
        <ReportQueueTable reports={reports} onRefresh={fetchReports} />
      )}
    </div>
  );
}
