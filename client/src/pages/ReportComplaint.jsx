import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, ThumbsUp } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import * as complaintService from '../services/complaintService';
import appConfig from '../config/appConfig';

const ReportComplaint = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', category: '', description: '', area: '', imageUrl: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [checking, setChecking] = useState(false);
  const [duplicates, setDuplicates] = useState(null); // null = not checked yet, [] = checked, none found

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.category) e.category = 'Category is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.area.trim()) e.area = 'Area is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const runDuplicateCheck = async () => {
    if (!form.category || !form.area) return;
    setChecking(true);
    try {
      const res = await complaintService.checkDuplicates(form.category, form.area);
      setDuplicates(res.data.data);
    } catch (err) {
      // silently ignore — duplicate check is a helper, not a blocker
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    // Run the duplicate check right before submitting if it hasn't been run for the current category/area yet
    if (duplicates === null) {
      await runDuplicateCheck();
      return; // let the user see the warning (if any) before confirming submission
    }

    setSaving(true);
    try {
      await complaintService.createComplaint(form);
      toast.success('Complaint submitted');
      navigate('/complaints/mine');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setForm({ ...form, [field]: value });
    setDuplicates(null); // reset duplicate check when category/area/etc changes
  };

  const handleUpvoteExisting = async (id) => {
    try {
      await complaintService.upvoteComplaint(id);
      toast.success('Upvoted the existing complaint instead');
      navigate(`/complaints/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upvote');
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
        <ArrowLeft size={15} /> Back to Dashboard
      </Link>
      <h1 className="text-2xl font-bold">Report a Complaint</h1>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title" required value={form.title} error={errors.title} onChange={(e) => handleFieldChange('title', e.target.value)} placeholder="e.g. Pothole on Main Street" />
          <Select label="Category" required options={appConfig.categories} value={form.category} error={errors.category} onChange={(e) => handleFieldChange('category', e.target.value)} />
          <Input label="Area / Locality" required value={form.area} error={errors.area} onChange={(e) => handleFieldChange('area', e.target.value)} placeholder="e.g. Sector G-9" />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description <span className="text-red-500">*</span></label>
            <textarea className={`input-base ${errors.description ? 'border-red-500' : ''}`} rows={4} value={form.description} onChange={(e) => handleFieldChange('description', e.target.value)} placeholder="Describe the issue in detail..." />
            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
          </div>
          <Input label="Photo URL (optional)" value={form.imageUrl} onChange={(e) => handleFieldChange('imageUrl', e.target.value)} placeholder="https://..." />

          {duplicates && duplicates.length > 0 && (
            <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-500/10 p-4">
              <div className="flex gap-2 mb-3">
                <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  A similar complaint already exists in this area — would you like to upvote it instead?
                </p>
              </div>
              <div className="space-y-2">
                {duplicates.slice(0, 3).map((d) => (
                  <div key={d._id} className="flex items-center justify-between bg-white dark:bg-gray-900 rounded-lg px-3 py-2">
                    <span className="text-sm truncate">{d.title}</span>
                    <button type="button" onClick={() => handleUpvoteExisting(d._id)} className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:underline shrink-0 ml-2">
                      <ThumbsUp size={12} /> Upvote
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => navigate('/dashboard')}>Cancel</Button>
            <Button type="submit" loading={saving || checking}>
              {duplicates === null ? 'Check & Continue' : 'Submit Complaint'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ReportComplaint;
