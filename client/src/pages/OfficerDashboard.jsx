import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Download, Filter, X, TrendingUp, Clock, CheckCircle2, AlertTriangle, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import * as complaintService from '../services/complaintService';
import * as statsService from '../services/statsService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/Loading';
import EmptyState from '../components/ui/EmptyState';
import appConfig from '../config/appConfig';

const OfficerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ category: '', area: '', status: '', priority: '' });
  const [showFilters, setShowFilters] = useState(false);

  const fetchComplaints = useCallback(() => {
    setLoading(true);
    complaintService.getComplaints({ search, ...filters, sort: '-createdAt', limit: 100 })
      .then((res) => setComplaints(res.data.data))
      .catch(() => toast.error('Failed to load complaints'))
      .finally(() => setLoading(false));
  }, [search, filters]);

  useEffect(() => {
    statsService.getOfficerStats().then((res) => setStats(res.data.data)).catch(() => {}).finally(() => setStatsLoading(false));
  }, []);

  useEffect(() => {
    const t = setTimeout(fetchComplaints, 300);
    return () => clearTimeout(t);
  }, [fetchComplaints]);

  const clearFilters = () => setFilters({ category: '', area: '', status: '', priority: '' });

  const handleExport = () => {
    const url = complaintService.exportComplaintsUrl({ search, ...filters });
    const token = localStorage.getItem('portal_token');
    // Trigger download via a temporary link; the export endpoint requires auth, so we
    // fetch as a blob rather than a plain navigation (no way to attach a header to <a href>).
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (!res.ok) throw new Error('Export failed');
        return res.blob();
      })
      .then((blob) => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `complaints_export_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
      })
      .catch(() => toast.error('Failed to export CSV'));
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Officer Dashboard</h1>
          <p className="text-gray-500 mt-1">All reported complaints across the system.</p>
        </div>
        <Button variant="secondary" onClick={handleExport}><Download size={16} /> Download CSV</Button>
      </div>

      {/* AI Daily Briefing for Officers Card */}
      {statsLoading ? (
        <Card className="!bg-emerald-50/50 dark:!bg-emerald-950/40 !border-emerald-200 dark:!border-emerald-800 animate-pulse p-5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-200 dark:bg-emerald-800" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-40 bg-emerald-200 dark:bg-emerald-800 rounded" />
              <div className="h-3 w-full bg-emerald-100 dark:bg-emerald-900 rounded" />
            </div>
          </div>
        </Card>
      ) : stats && (
        <Card className="!bg-emerald-50 dark:!bg-emerald-950 !border-emerald-200 dark:!border-emerald-800 shadow-sm">
          <div className="flex items-start gap-3.5">
            <div className="h-9 w-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <TrendingUp size={16} />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-emerald-900 dark:text-emerald-200">AI Daily Briefing</h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300">
                    Claude AI
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                {stats.aiSummary || (
                  <>
                    {stats.total} total complaints, {stats.newToday} filed today
                    {stats.critical > 0 && <>, <span className="font-medium text-red-600">{stats.critical} critical</span></>}
                    {stats.overdue > 0 && <>, {stats.overdue} overdue by more than 3 days</>}.{' '}
                    {stats.resolvedThisWeek} resolved this week.
                    {stats.hotspotAreas[0] && <> Highest upvote activity in <span className="font-medium">{stats.hotspotAreas[0].name}</span>.</>}
                    {stats.avgSatisfaction !== null && <> Average citizen satisfaction: {stats.avgSatisfaction}/5.</>}
                  </>
                )}
              </p>
            </div>
          </div>
        </Card>
      )}

      {!statsLoading && stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card><p className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12} /> Pending</p><h3 className="text-2xl font-bold mt-1">{stats.statusCounts.Pending}</h3></Card>
          <Card><p className="text-xs text-gray-500 flex items-center gap-1"><AlertTriangle size={12} /> Overdue</p><h3 className="text-2xl font-bold mt-1">{stats.overdue}</h3></Card>
          <Card><p className="text-xs text-gray-500 flex items-center gap-1"><CheckCircle2 size={12} /> Resolved (7d)</p><h3 className="text-2xl font-bold mt-1">{stats.resolvedThisWeek}</h3></Card>
          <Card><p className="text-xs text-gray-500 flex items-center gap-1"><Star size={12} /> Satisfaction</p><h3 className="text-2xl font-bold mt-1">{stats.avgSatisfaction ?? '—'}</h3></Card>
        </div>
      )}

      <Card>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input className="input-base flex-1" placeholder="Search complaints..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <Button variant="secondary" onClick={() => setShowFilters((s) => !s)}><Filter size={16} /> Filters</Button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
            <Select placeholder="All Categories" options={appConfig.categories} value={filters.category} onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))} />
            <input className="input-base" placeholder="Area" value={filters.area} onChange={(e) => setFilters((f) => ({ ...f, area: e.target.value }))} />
            <Select placeholder="All Statuses" options={appConfig.statuses} value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))} />
            <Select placeholder="All Priorities" options={appConfig.priorities} value={filters.priority} onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))} />
            <button onClick={clearFilters} className="col-span-2 sm:col-span-4 flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <X size={14} /> Clear Filters
            </button>
          </div>
        )}

        {loading ? <LoadingSpinner size={28} className="py-10" /> : !complaints.length ? (
          <EmptyState title="No complaints found" message="Try adjusting your filters." />
        ) : (
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 text-left text-gray-500">
                  <th className="py-3 px-3 font-medium">Title</th>
                  <th className="py-3 px-3 font-medium">Category</th>
                  <th className="py-3 px-3 font-medium">Area</th>
                  <th className="py-3 px-3 font-medium">Status</th>
                  <th className="py-3 px-3 font-medium">Priority</th>
                  <th className="py-3 px-3 font-medium">Upvotes</th>
                  <th className="py-3 px-3 font-medium">Filed By</th>
                  <th className="py-3 px-3 font-medium">Date</th>
                  <th className="py-3 px-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                 <tr key={c._id} className="border-b border-gray-100 dark:border-gray-800/60 hover:bg-gray-50 dark:hover:bg-gray-800/40">
  <td className="py-3 px-3">
    <Link to={`/officer/complaints/${c._id}`} className="font-medium hover:text-primary-600">
      {c.title}
    </Link>
  </td>
  <td className="py-3 px-3"><Badge value={c.category} /></td>
  <td className="py-3 px-3 whitespace-nowrap">{c.area}</td>
  <td className="py-3 px-3">
    <Link to={`/officer/complaints/${c._id}`}>
      <Badge value={c.status} />
    </Link>
  </td>
  <td className="py-3 px-3"><Badge value={c.priority} /></td>
  <td className="py-3 px-3">{c.upvotes}</td>
  <td className="py-3 px-3 whitespace-nowrap">{c.createdBy?.name || '—'}</td>
  <td className="py-3 px-3 whitespace-nowrap">{new Date(c.createdAt).toLocaleDateString()}</td>
  <td className="py-3 px-3 text-right whitespace-nowrap">
    <Link 
      to={`/officer/complaints/${c._id}`} 
      className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-md bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-950/50 dark:hover:bg-primary-900/50"
    >
      Review →
    </Link>
  </td>
</tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default OfficerDashboard;
