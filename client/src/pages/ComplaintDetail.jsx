import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, MapPin, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import * as complaintService from '../services/complaintService';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/Loading';

const ComplaintDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    complaintService.getComplaint(id)
      .then((res) => setComplaint(res.data.data))
      .catch(() => toast.error('Failed to load complaint'))
      .finally(() => setLoading(false));
  };

  useEffect(fetchData, [id]);

  const handleUpvote = async () => {
    if (!isAuthenticated) return toast.error('Please log in as a citizen to upvote');
    if (user.role !== 'citizen') return toast.error('Only citizens can upvote');
    try {
      await complaintService.upvoteComplaint(id);
      toast.success('Upvoted');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upvote');
    }
  };

  if (loading) return <LoadingSpinner size={32} className="py-24" />;
  if (!complaint) return <p className="text-center text-gray-500 py-24">Complaint not found.</p>;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <Link to="/complaints" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
        <ArrowLeft size={15} /> Back to Browse
      </Link>

      <Card>
        <div className="flex items-start justify-between gap-3 mb-3">
          <h1 className="text-xl font-bold">{complaint.title}</h1>
          <Badge value={complaint.priority} />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge value={complaint.category} />
          <Badge value={complaint.status} />
          <span className="flex items-center gap-1 text-xs text-gray-400"><MapPin size={12} /> {complaint.area}</span>
          <span className="flex items-center gap-1 text-xs text-gray-400"><UserIcon size={12} /> {complaint.createdBy?.name || 'Citizen'}</span>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-5">{complaint.description}</p>

        {complaint.imageUrl && (
          <img src={complaint.imageUrl} alt="Complaint" className="rounded-xl mb-5 max-h-80 w-full object-cover" />
        )}

        {complaint.officerRemark && (
          <div className="rounded-xl bg-gray-50 dark:bg-gray-800/60 p-3 mb-5">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Officer Remark</p>
            <p className="text-sm">{complaint.officerRemark}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
          <span className="text-xs text-gray-400">Filed on {new Date(complaint.createdAt).toLocaleDateString()}</span>
          <Button onClick={handleUpvote}><ThumbsUp size={15} /> {complaint.upvotes} Upvotes</Button>
        </div>
      </Card>
    </div>
  );
};

export default ComplaintDetail;
