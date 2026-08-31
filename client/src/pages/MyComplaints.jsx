import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';
import * as complaintService from '../services/complaintService';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { LoadingSpinner } from '../components/ui/Loading';
import { Link } from 'react-router-dom';

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackTarget, setFeedbackTarget] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = () => {
    complaintService.getMyComplaints()
      .then((res) => setComplaints(res.data.data))
      .catch(() => toast.error('Failed to load your complaints'))
      .finally(() => setLoading(false));
  };

  useEffect(fetchData, []);

  const handleFeedbackSubmit = async () => {
    if (!rating) return toast.error('Please select a rating');
    setSubmitting(true);
    try {
      await complaintService.submitFeedback(feedbackTarget._id, { rating, comment });
      toast.success('Thanks for your feedback!');
      setFeedbackTarget(null);
      setRating(0);
      setComment('');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner size={32} className="py-24" />;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">My Complaints</h1>

      {!complaints.length ? (
        <Card>
          <EmptyState title="No complaints filed yet" message="Report your first civic issue to get started." action={<Link to="/complaints/new"><Button>Report a Complaint</Button></Link>} />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {complaints.map((c) => (
            <Card key={c._id}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <Link to={`/complaints/${c._id}`} className="font-semibold hover:text-primary-600">{c.title}</Link>
                <Badge value={c.priority} />
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 mb-3">{c.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge value={c.category} />
                <Badge value={c.status} />
              </div>
              {c.officerRemark && (
                <p className="text-xs bg-gray-50 dark:bg-gray-800/60 rounded-lg p-2 mb-3">
                  <span className="font-medium">Officer remark:</span> {c.officerRemark}
                </p>
              )}
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Filed {new Date(c.createdAt).toLocaleDateString()}</span>
                {c.feedbackPending && (
                  <Button onClick={() => setFeedbackTarget(c)} className="!py-1.5 !px-3 text-xs">Rate Resolution</Button>
                )}
                {c.feedbackGiven && (
                  <span className="flex items-center gap-1 text-amber-500">
                    <Star size={12} fill="currentColor" /> {c.feedbackRating}/5 rated
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!feedbackTarget} onClose={() => setFeedbackTarget(null)} title="Rate the resolution" size="sm">
        <p className="text-sm text-gray-500 mb-4">Was your issue resolved? Your feedback helps improve response quality.</p>
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setRating(n)} className="p-1">
              <Star size={26} className={n <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-700'} />
            </button>
          ))}
        </div>
        <textarea className="input-base" rows={3} placeholder="Any additional comments? (optional)" value={comment} onChange={(e) => setComment(e.target.value)} />
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="secondary" onClick={() => setFeedbackTarget(null)}>Cancel</Button>
          <Button onClick={handleFeedbackSubmit} loading={submitting}>Submit Feedback</Button>
        </div>
      </Modal>
    </div>
  );
};

export default MyComplaints;
