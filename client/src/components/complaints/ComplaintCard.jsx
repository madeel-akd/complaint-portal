import React from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, MapPin } from 'lucide-react';
import Badge from '../ui/Badge';

const timeAgo = (date) => {
  const diff = (Date.now() - new Date(date).getTime()) / 1000;
  if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const ComplaintCard = ({ complaint, onUpvote, upvoteDisabled, linkTo }) => (
  <div className="card p-4 flex flex-col gap-3">
    <div className="flex items-start justify-between gap-3">
      <Link to={linkTo || `/complaints/${complaint._id}`} className="font-semibold hover:text-primary-600 leading-snug">
        {complaint.title}
      </Link>
      <Badge value={complaint.priority} />
    </div>

    <p className="text-sm text-gray-500 line-clamp-2">{complaint.description}</p>

    <div className="flex flex-wrap items-center gap-2">
      <Badge value={complaint.category} />
      <Badge value={complaint.status} />
      <span className="flex items-center gap-1 text-xs text-gray-400">
        <MapPin size={12} /> {complaint.area}
      </span>
    </div>

    <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
      <span className="text-xs text-gray-400">{timeAgo(complaint.createdAt)}</span>
      <button
        onClick={() => onUpvote && onUpvote(complaint)}
        disabled={upvoteDisabled}
        className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-500/10 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ThumbsUp size={14} /> {complaint.upvotes}
      </button>
    </div>
  </div>
);

export default ComplaintCard;
