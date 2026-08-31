import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  TrendingUp, 
  ThumbsUp, 
  ArrowRight, 
  PlusCircle, 
  CheckCircle,
  FileText,
  Users
} from 'lucide-react';
import * as complaintService from '../services/complaintService';
import Button from '../components/ui/Button';
import ComplaintCard from '../components/complaints/ComplaintCard';
import { LoadingSpinner } from '../components/ui/Loading';
import appConfig from '../config/appConfig';

const RESOLVED_SHOWCASE = [
  {
    id: 'res-1',
    title: 'Main Boulevard Potholes & Road Re-surfacing',
    category: 'Road',
    area: 'Sector 4, North Avenue',
    resolvedIn: 'Resolved in 24 hrs',
    officerRemark: 'Road excavation sealed and fresh bitumen hot-mix applied by Ward 4 road crew.',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    date: 'Yesterday',
    upvotes: 42,
  },
  {
    id: 'res-2',
    title: 'Community Park Waste Clearing & New Bins',
    category: 'Garbage',
    area: 'Greenwood Heights Park',
    resolvedIn: 'Resolved in 18 hrs',
    officerRemark: 'Site sanitized, all waste removed, and 4 high-capacity segregated bins installed.',
    imageUrl: 'https://trpreadymix.com/wp-content/uploads/2019/11/fixes-to-damaged-roads.png',
    date: '2 days ago',
    upvotes: 68,
  },
  {
    id: 'res-3',
    title: 'Faulty Streetlight Replacement on 5th Cross',
    category: 'Electricity',
    area: 'Maple Street & 5th Cross',
    resolvedIn: 'Resolved in 12 hrs',
    officerRemark: 'Replaced defective transformer line and fitted new high-efficiency LED lights.',
    imageUrl: 'https://albalighting.pk/wp-content/uploads/2026/03/1C-17.jpg',
    date: '3 days ago',
    upvotes: 31,
  },
  {
    id: 'res-4',
    title: 'Drinking Water Pipeline Leak Sealed',
    category: 'Water',
    area: 'Sunrise Colony Block B',
    resolvedIn: 'Resolved in 1 day',
    officerRemark: 'Underground joint repaired, pressure test successful, water supply fully restored.',
    imageUrl: 'https://www.avkhk.com/-/media/websites/local-websites/avk-international/images/cases/water-transmission-line-installation.jpg?mw=1920&rev=dbaa9d23-8f88-4360-b3aa-f45b80d997be&hash=E99F348D8B619D7E06574367911A261F',
    date: '4 days ago',
    upvotes: 55,
  },
];

const Landing = () => {
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    complaintService.getComplaints({ limit: 3, sort: '-createdAt' })
      .then((res) => setRecent(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section with Solid Clean Green Theme */}
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 sm:p-12 text-center shadow-sm">
        <div className="max-w-3xl mx-auto space-y-5">
          <div className="flex justify-center mb-2">
            <img 
              src="/assets/logo-shield-hero.png" 
              alt="Citizen Complaint Portal Shield" 
              className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl object-contain shadow-md"
            />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
            <img src="/assets/icon-badge-green.png" alt="Badge" className="h-4 w-4 rounded object-contain" />
            <span>Community Civic Action Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
            Building Cleaner, Safer & <br className="hidden sm:inline" />
            <span className="text-emerald-600 dark:text-emerald-400">
              Better Neighborhoods Together
            </span>
          </h1>

          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Report road damage, garbage pileups, water leaks, or streetlight failures. Track real officer updates from investigation to complete resolution.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link to="/signup">
              <Button className="!bg-emerald-600 hover:!bg-emerald-700 !text-white !px-6 !py-3 !text-base shadow-sm">
                <PlusCircle size={18} /> Report an Issue Now
              </Button>
            </Link>
            <Link to="/complaints">
              <Button variant="secondary" className="!px-6 !py-3 !text-base border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                Browse Active Issues
              </Button>
            </Link>
          </div>

          {/* Platform Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-8 border-t border-gray-100 dark:border-gray-800">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">4,850+</div>
              <div className="text-xs text-gray-500 font-medium mt-0.5">Issues Resolved</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">24-48h</div>
              <div className="text-xs text-gray-500 font-medium mt-0.5">Avg. Response Time</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">96%</div>
              <div className="text-xs text-gray-500 font-medium mt-0.5">Citizen Satisfaction</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">100%</div>
              <div className="text-xs text-gray-500 font-medium mt-0.5">Transparent Tracking</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section: Issues Resolved Showcase With Pictures */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <CheckCircle size={16} /> Community Impact
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Recently Resolved by Officers
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Verified civic repairs, municipal cleanups, and infrastructure fixes completed in our city.
            </p>
          </div>
          <Link 
            to="/complaints" 
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            View all resolutions <ArrowRight size={16} />
          </Link>
        </div>

        {/* 4-Card Picture Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {RESOLVED_SHOWCASE.map((item) => (
            <div 
              key={item.id} 
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-sm">
                    <CheckCircle2 size={12} /> Resolved
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 shadow-sm border border-gray-200 dark:border-gray-700">
                    {item.category}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 bg-gray-900/80 text-white px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                  <Clock size={12} /> {item.resolvedIn}
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-bold text-base text-gray-900 dark:text-white leading-snug">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                    <MapPin size={13} className="text-emerald-500" />
                    <span>{item.area}</span>
                    <span>•</span>
                    <span>{item.date}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-gray-200 mb-1">
                    <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
                    <span>Officer Action Note</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    "{item.officerRemark}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400">
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                    <ThumbsUp size={13} /> {item.upvotes} Citizens Supported
                  </span>
                  <span className="font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                    Verified Resolution
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            Simple 3-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold mt-1 text-gray-900 dark:text-white">
            How the Citizen Complaint Portal Works
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            A fast and transparent system for community issue resolution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 border-gray-200 dark:border-gray-800 text-center">
            <div className="h-12 w-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto mb-4 font-bold text-lg">
              1
            </div>
            <h3 className="font-bold text-base mb-2">Snap and Report</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Upload a picture, choose your area, and describe the civic problem in under 60 seconds.
            </p>
          </div>

          <div className="card p-6 border-gray-200 dark:border-gray-800 text-center">
            <div className="h-12 w-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto mb-4 font-bold text-lg">
              2
            </div>
            <h3 className="font-bold text-base mb-2">Upvote and Prioritize</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Neighbors upvote common concerns. High-vote issues automatically receive higher priority.
            </p>
          </div>

          <div className="card p-6 border-gray-200 dark:border-gray-800 text-center">
            <div className="h-12 w-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto mb-4 font-bold text-lg">
              3
            </div>
            <h3 className="font-bold text-base mb-2">Officer Action and Resolution</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Assigned department teams resolve the issue, leave completion remarks, and notify citizens.
            </p>
          </div>
        </div>
      </section>

      {/* Live Recent Complaints Feed */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-bold text-xl text-gray-900 dark:text-white">Live Citizen Reports</h2>
            <p className="text-xs text-gray-500 mt-0.5">Recent issues posted by citizens across the city</p>
          </div>
          <Link to="/complaints" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
            View All Reports →
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner className="py-12" />
        ) : recent.length === 0 ? (
          <div className="card p-8 text-center text-gray-500 text-sm">
            No complaints reported recently. Be the first to report an issue!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {recent.map((c) => (
              <ComplaintCard key={c._id} complaint={c} />
            ))}
          </div>
        )}
      </section>

      {/* Bottom CTA Banner with Solid Green */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="rounded-3xl bg-emerald-600 p-8 sm:p-12 text-white text-center shadow-md">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Spotted a Civic Problem in Your Area?
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base">
              Report it in 1 minute and track our municipal team taking action.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link to="/signup">
                <Button className="!bg-white !text-emerald-800 hover:!bg-emerald-50 !font-bold !px-6 !py-3 shadow-sm">
                  Report an Issue Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
