import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FilePlus, 
  ClipboardList, 
  Search, 
  CheckCircle2, 
  Clock, 
  ThumbsUp, 
  TrendingUp, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  Star,
  MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import * as complaintService from '../services/complaintService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/Loading';

const CitizenDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    complaintService.getMyComplaints()
      .then((res) => setComplaints(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const total = complaints.length;
  const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
  const pending = complaints.filter((c) => c.status === 'Pending').length;
  const resolved = complaints.filter((c) => c.status === 'Resolved').length;
  const totalUpvotes = complaints.reduce((sum, c) => sum + (c.upvotes || 0), 0);
  const pendingFeedback = complaints.filter((c) => c.feedbackPending);

  // Time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-7">
      {/* Top Welcome Banner with Solid Clean Green */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-emerald-600 text-white shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700 text-xs font-semibold text-emerald-100">
            <img src="/assets/icon-badge-green.png" alt="Badge" className="h-4 w-4 rounded object-contain" />
            <span>Citizen Portal Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            {getGreeting()}, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-emerald-100 text-sm max-w-xl">
            Track your reported issues, monitor municipal progress in real-time, and help improve our city.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/complaints/new">
            <Button className="!bg-white !text-emerald-800 hover:!bg-emerald-50 !font-bold !py-2.5 !px-5 shadow-sm">
              <FilePlus size={16} /> Report New Issue
            </Button>
          </Link>
        </div>
      </div>

      {/* Pending Satisfaction Feedback Notification */}
      {pendingFeedback.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <Star size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                Feedback Needed on {pendingFeedback.length} Resolved Issue{pendingFeedback.length > 1 ? 's' : ''}
              </h4>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                Please rate the officer resolution quality to help keep civic service high.
              </p>
            </div>
          </div>
          <Link to="/complaints/mine">
            <Button className="!bg-amber-600 hover:!bg-amber-700 !text-white !py-1.5 !px-3.5 !text-xs whitespace-nowrap">
              Rate Now →
            </Button>
          </Link>
        </div>
      )}

      {/* KPI Metrics Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="!p-5 border-gray-200 dark:border-gray-800 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Reported</span>
            <div className="h-8 w-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ClipboardList size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">
            {loading ? '...' : total}
          </h3>
          <p className="text-xs text-gray-400 mt-1">Issues submitted by you</p>
        </Card>

        <Card className="!p-5 border-gray-200 dark:border-gray-800 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">In Progress</span>
            <div className="h-8 w-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-bold mt-2 text-blue-600 dark:text-blue-400">
            {loading ? '...' : inProgress}
          </h3>
          <p className="text-xs text-gray-400 mt-1">Team assigned or inspecting</p>
        </Card>

        <Card className="!p-5 border-gray-200 dark:border-gray-800 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Resolved</span>
            <div className="h-8 w-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-bold mt-2 text-emerald-600 dark:text-emerald-400">
            {loading ? '...' : resolved}
          </h3>
          <p className="text-xs text-gray-400 mt-1">Completed & closed</p>
        </Card>

        <Card className="!p-5 border-gray-200 dark:border-gray-800 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Community Upvotes</span>
            <div className="h-8 w-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <ThumbsUp size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-bold mt-2 text-purple-600 dark:text-purple-400">
            {loading ? '...' : totalUpvotes}
          </h3>
          <p className="text-xs text-gray-400 mt-1">Neighbor support received</p>
        </Card>
      </div>

      {/* Quick Action Navigation Cards */}
      <div>
        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/complaints/new" className="group">
            <Card className="p-5 h-full border-gray-200 dark:border-gray-800 hover:border-emerald-500 transition">
              <div className="h-10 w-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-3">
                <FilePlus size={20} />
              </div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white group-hover:text-emerald-600 transition flex items-center justify-between">
                Report an Issue <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition transform group-hover:translate-x-1" />
              </h3>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                Take a photo, pick your neighborhood, and lodge a report in under 60 seconds.
              </p>
            </Card>
          </Link>

          <Link to="/complaints/mine" className="group">
            <Card className="p-5 h-full border-gray-200 dark:border-gray-800 hover:border-emerald-500 transition">
              <div className="h-10 w-10 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-3">
                <ClipboardList size={20} />
              </div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white group-hover:text-emerald-600 transition flex items-center justify-between">
                My Reported Complaints <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition transform group-hover:translate-x-1" />
              </h3>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                Track status changes, read municipal officer notes, and review past submissions.
              </p>
            </Card>
          </Link>

          <Link to="/complaints" className="group">
            <Card className="p-5 h-full border-gray-200 dark:border-gray-800 hover:border-emerald-500 transition">
              <div className="h-10 w-10 rounded-2xl bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 flex items-center justify-center mb-3">
                <Search size={20} />
              </div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white group-hover:text-emerald-600 transition flex items-center justify-between">
                Browse Community Feed <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition transform group-hover:translate-x-1" />
              </h3>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                Explore nearby issues reported by other citizens and upvote to boost priority.
              </p>
            </Card>
          </Link>
        </div>
      </div>

      {/* Recent Personal Complaints Tracker */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-base text-gray-900 dark:text-white">
              Recent Issues You Reported
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Live status of your latest submissions
            </p>
          </div>
          {complaints.length > 0 && (
            <Link to="/complaints/mine" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">
              View All ({complaints.length}) →
            </Link>
          )}
        </div>

        {loading ? (
          <LoadingSpinner size={24} className="py-10" />
        ) : complaints.length === 0 ? (
          <div className="text-center py-10 px-4 space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 mx-auto flex items-center justify-center">
              <ClipboardList size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-sm">No complaints submitted yet</h4>
              <p className="text-xs text-gray-500 mt-1">Have a broken road, water leak, or streetlight issue in your area?</p>
            </div>
            <Link to="/complaints/new">
              <Button className="!py-2 !px-4 !text-xs !bg-emerald-600 hover:!bg-emerald-700 text-white">
                Report Your First Issue
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 text-left text-gray-400 text-xs uppercase tracking-wider">
                  <th className="py-3 px-3 font-semibold">Title</th>
                  <th className="py-3 px-3 font-semibold">Category</th>
                  <th className="py-3 px-3 font-semibold">Area</th>
                  <th className="py-3 px-3 font-semibold">Status</th>
                  <th className="py-3 px-3 font-semibold">Officer Remark</th>
                  <th className="py-3 px-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                {complaints.slice(0, 5).map((c) => (
                  <tr key={c._id} className="hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition">
                    <td className="py-3 px-3">
                      <Link to={`/complaints/${c._id}`} className="font-semibold text-gray-900 dark:text-white hover:text-emerald-600 line-clamp-1">
                        {c.title}
                      </Link>
                    </td>
                    <td className="py-3 px-3"><Badge value={c.category} /></td>
                    <td className="py-3 px-3 text-xs text-gray-500 whitespace-nowrap">{c.area}</td>
                    <td className="py-3 px-3"><Badge value={c.status} /></td>
                    <td className="py-3 px-3 text-xs text-gray-600 dark:text-gray-300 max-w-xs truncate">
                      {c.officerRemark ? (
                        <span className="italic text-emerald-700 dark:text-emerald-300">"{c.officerRemark}"</span>
                      ) : (
                        <span className="text-gray-400">Awaiting officer update</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <Link 
                        to={`/complaints/${c._id}`}
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                      >
                        Details →
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

export default CitizenDashboard;
