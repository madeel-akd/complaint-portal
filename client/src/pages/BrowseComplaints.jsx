import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Filter, X } from 'lucide-react';
import * as complaintService from '../services/complaintService';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import ComplaintCard from '../components/complaints/ComplaintCard';
import EmptyState from '../components/ui/EmptyState';
import { LoadingSpinner } from '../components/ui/Loading';
import appConfig from '../config/appConfig';

const BrowseComplaints = () => {
  const { user, isAuthenticated } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ category: '', area: '', status: '', priority: '' });
  const [showFilters, setShowFilters] = useState(false);

  const fetchData = useCallback(() => {
    setLoading(true);
    complaintService.getComplaints({ search, ...filters, sort: '-createdAt', limit: 50 })
      .then((res) => setComplaints(res.data.data))
      .catch(() => toast.error('Failed to load complaints'))
      .finally(() => setLoading(false));
  }, [search, filters]);

  useEffect(() => {
    const t = setTimeout(fetchData, 300);
    return () => clearTimeout(t);
  }, [fetchData]);

  const handleUpvote = async (complaint) => {
    if (!isAuthenticated) return toast.error('Please log in as a citizen to upvote');
    if (user.role !== 'citizen') return toast.error('Only citizens can upvote');
    try {
      await complaintService.upvoteComplaint(complaint._id);
      setComplaints((prev) => prev.map((c) => (c._id === complaint._id ? { ...c, upvotes: c.upvotes + 1 } : c)));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upvote');
    }
  };

  const clearFilters = () => setFilters({ category: '', area: '', status: '', priority: '' });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Browse Complaints</h1>
        <p className="text-gray-500 mt-1">See what's already been reported before filing a new one.</p>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input className="input-base flex-1" placeholder="Search complaints..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <Button variant="secondary" onClick={() => setShowFilters((s) => !s)}><Filter size={16} /> Filters</Button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-2 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
            <Select placeholder="All Categories" options={appConfig.categories} value={filters.category} onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))} />
            <input className="input-base" placeholder="Area" value={filters.area} onChange={(e) => setFilters((f) => ({ ...f, area: e.target.value }))} />
            <Select placeholder="All Statuses" options={appConfig.statuses} value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))} />
            <Select placeholder="All Priorities" options={appConfig.priorities} value={filters.priority} onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))} />
            <button onClick={clearFilters} className="col-span-2 sm:col-span-4 flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <X size={14} /> Clear Filters
            </button>
          </div>
        )}
      </Card>

      {loading ? <LoadingSpinner size={32} className="py-16" /> : !complaints.length ? (
        <Card><EmptyState title="No complaints found" message="Try adjusting your filters." /></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {complaints.map((c) => (
            <ComplaintCard key={c._id} complaint={c} onUpvote={handleUpvote} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseComplaints;
