// Priority = upvotes x 2 + daysSinceCreated
// <5 Low, 5-15 Medium, 16-30 High, >30 Critical
const computePriority = (complaint) => {
  const days = Math.floor((Date.now() - new Date(complaint.createdAt).getTime()) / 86400000);
  const score = complaint.upvotes * 2 + days;

  let level = 'Low';
  if (score > 30) level = 'Critical';
  else if (score >= 16) level = 'High';
  else if (score >= 5) level = 'Medium';

  return { score, level };
};

const withPriority = (complaintDoc) => {
  const obj = complaintDoc.toObject ? complaintDoc.toObject() : complaintDoc;
  const { score, level } = computePriority(obj);
  return { ...obj, priorityScore: score, priority: level };
};

module.exports = { computePriority, withPriority };
