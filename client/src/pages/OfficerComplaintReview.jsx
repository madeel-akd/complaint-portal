import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, User as UserIcon, ThumbsUp, CheckCircle, Clock, Wrench } from 'lucide-react';
import toast from 'react-hot-toast';
import * as complaintService from '../services/complaintService';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/Loading';
import appConfig from '../config/appConfig';

const OfficerComplaintReview = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [remark, setRemark] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchData = () => {
    complaintService.getComplaint(id)
      .then((res) => {
        setComplaint(res.data.data);
        setStatus(res.data.data.status);
        setRemark(res.data.data.officerRemark || '');
      })
      .catch(() => toast.error('Failed to load complaint'))
      .finally(() => setLoading(false));
  };

  useEffect(fetchData, [id]);

  // Quick preset helper
  const applyPreset = (newStatus, defaultRemark) => {
    setStatus(newStatus);
    setRemark(defaultRemark);
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await complaintService.updateStatus(id, { status, remark });
      toast.success('Complaint status and remark updated successfully');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update complaint');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner size={32} className="py-24" />;
  if (!complaint) return <p className="text-center text-gray-500 py-24">Complaint not found.</p>;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <Link to="/officer/dashboard" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
        <ArrowLeft size={15} /> Back to Officer Dashboard
      </Link>

      {/* Complaint Details Card */}
      <Card>
        <div className="flex items-start justify-between gap-3 mb-3">
          <h1 className="text-xl font-bold">{complaint.title}</h1>
          <Badge value={complaint.priority} />
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge value={complaint.category} />
          <Badge value={complaint.status} />
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <MapPin size={12} /> {complaint.area}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <UserIcon size={12} /> {complaint.createdBy?.name || 'Citizen'} ({complaint.createdBy?.email})
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <ThumbsUp size={12} /> {complaint.upvotes} upvotes
          </span>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{complaint.description}</p>
        
        {complaint.imageUrl && (
          <img src={complaint.imageUrl} alt="Complaint attachment" className="rounded-xl mb-4 max-h-72 w-full object-cover" />
        )}

        {complaint.feedbackGiven && (
          <div className="rounded-xl bg-gray-50 dark:bg-gray-800/60 p-3 mb-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Citizen Feedback</p>
            <p className="text-sm">{complaint.feedbackRating}/5 {complaint.feedbackComment && `— "${complaint.feedbackComment}"`}</p>
          </div>
        )}
      </Card>

      {/* Review & Action Panel */}
      <Card title="Review & Update Status">
        <div className="space-y-4">
          {/* Quick Preset Buttons */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Quick Action Templates
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyPreset('In Progress', 'Field team assigned and dispatched to the location.')}
                className="text-xs font-medium px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 flex items-center gap-1"
              >
                <Wrench size={13} /> Team Assigned
              </button>
              <button
                type="button"
                onClick={() => applyPreset('In Progress', 'Under inspection by municipal department.')}
                className="text-xs font-medium px-3 py-1.5 rounded-lg border border-blue-300 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 flex items-center gap-1"
              >
                <Clock size={13} /> Under Inspection
              </button>
              <button
                type="button"
                onClick={() => applyPreset('Resolved', 'Issue resolved successfully on site. Thank you for reporting.')}
                className="text-xs font-medium px-3 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 flex items-center gap-1"
              >
                <CheckCircle size={13} /> Issue Resolved (Done)
              </button>
            </div>
          </div>

          {/* Status Dropdown */}
          <Select 
            label="Status" 
            options={appConfig.statuses} 
            value={status} 
            onChange={(e) => setStatus(e.target.value)} 
          />

          {/* Officer Comment / Remark Box */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Officer Comment / Remark
            </label>
            <textarea 
              className="input-base" 
              rows={3} 
              value={remark} 
              onChange={(e) => setRemark(e.target.value)} 
              placeholder="e.g. Team assigned, work scheduled for completion by tomorrow." 
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <Button onClick={handleUpdate} loading={saving}>
              Save & Update Complaint
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OfficerComplaintReview;