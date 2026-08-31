const Anthropic = require('@anthropic-ai/sdk');
const Complaint = require('../models/Complaint');
const { withPriority } = require('../utils/priority');

// Fallback briefing generator in natural 3-5 sentences if Claude API key is missing or offline
const generateFallbackBriefing = (stats) => {
  const { total, newToday, overdue, resolvedThisWeek, critical, criticalItems, topCategories, hotspotAreas, avgSatisfaction } = stats;

  const sentences = [];

  // Sentence 1: Today's intake and totals
  if (newToday > 0) {
    sentences.push(`Today, ${newToday} new complaint${newToday > 1 ? 's have' : ' has'} been filed across the portal, bringing total active tracking to ${total} cases.`);
  } else {
    sentences.push(`There are currently ${total} total complaints recorded in the system, with no new submissions filed today.`);
  }

  // Sentence 2: Critical issues & Overdue alerts
  if (critical > 0) {
    const criticalDetailStr = criticalItems && criticalItems.length 
      ? ` (${criticalItems.map((c) => `${c.category} in ${c.area}`).slice(0, 2).join(', ')})`
      : '';
    sentences.push(`${critical} issue${critical > 1 ? 's require' : ' requires'} immediate critical attention${criticalDetailStr}${overdue > 0 ? `, and ${overdue} complaint${overdue > 1 ? 's are' : ' is'} overdue past 3 days` : ''}.`);
  } else if (overdue > 0) {
    sentences.push(`${overdue} complaint${overdue > 1 ? 's are' : ' is'} currently overdue past the 3-day resolution target and should be expedited.`);
  }

  // Sentence 3: Hotspot areas / top categories
  if (hotspotAreas && hotspotAreas.length > 0) {
    const topArea = hotspotAreas[0];
    const topCat = topCategories && topCategories.length ? topCategories[0].name : '';
    sentences.push(`${topArea.name} has recorded the highest community activity with ${topArea.upvotes} upvotes, primarily concerning ${topCat || 'civic'} issues.`);
  }

  // Sentence 4: Resolution velocity & citizen satisfaction
  if (resolvedThisWeek > 0) {
    sentences.push(`Municipal field teams successfully resolved ${resolvedThisWeek} issue${resolvedThisWeek > 1 ? 's' : ''} this week${avgSatisfaction ? ` with an average citizen satisfaction rating of ${avgSatisfaction}/5` : ''}.`);
  }

  return sentences.slice(0, 5).join(' ');
};

// @desc Computed stats & AI Daily Briefing for the officer dashboard.
// Calls the Claude API (Anthropic) to generate a concise 3-5 sentence briefing.
// @route GET /api/officer/stats
const getOfficerStats = async (req, res, next) => {
  try {
    const all = await Complaint.find().populate('createdBy', 'name');
    const complaints = all.map(withPriority);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const total = complaints.length;
    const newToday = complaints.filter((c) => new Date(c.createdAt) >= startOfToday).length;
    const overdue = complaints.filter((c) => c.status !== 'Resolved' && new Date(c.createdAt) <= threeDaysAgo).length;
    const resolvedThisWeek = complaints.filter((c) => c.status === 'Resolved' && new Date(c.statusUpdatedAt || c.updatedAt) >= weekAgo).length;
    const criticalComplaints = complaints.filter((c) => c.priority === 'Critical');
    const critical = criticalComplaints.length;
    const criticalItems = criticalComplaints.map((c) => ({ title: c.title, category: c.category, area: c.area }));

    const byCategory = {};
    const byArea = {};
    complaints.forEach((c) => {
      byCategory[c.category] = (byCategory[c.category] || 0) + 1;
      byArea[c.area] = (byArea[c.area] || 0) + c.upvotes;
    });
    const topCategories = Object.entries(byCategory).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([name, count]) => ({ name, count }));
    const hotspotAreas = Object.entries(byArea).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([name, upvotes]) => ({ name, upvotes }));

    const ratedResolved = complaints.filter((c) => c.feedbackGiven && c.feedbackRating);
    const avgSatisfaction = ratedResolved.length
      ? Math.round((ratedResolved.reduce((sum, c) => sum + c.feedbackRating, 0) / ratedResolved.length) * 10) / 10
      : null;
    const negativeFeedback = ratedResolved.filter((c) => c.feedbackRating <= 2).length;

    const statusCounts = {
      Pending: complaints.filter((c) => c.status === 'Pending').length,
      'In Progress': complaints.filter((c) => c.status === 'In Progress').length,
      Resolved: complaints.filter((c) => c.status === 'Resolved').length,
    };

    // AI Daily Briefing via Claude API
    let aiSummary = '';
    const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;

    if (apiKey) {
      try {
        const anthropic = new Anthropic({ apiKey });
        const criticalSummary = criticalItems.length 
          ? criticalItems.map((c) => `${c.category} in ${c.area}`).join(', ')
          : 'None';
        const categorySummary = topCategories.map((c) => `${c.name}: ${c.count}`).join(', ');
        const hotspotSummary = hotspotAreas.map((a) => `${a.name}: ${a.upvotes} upvotes`).join(', ');

        const prompt = `You are an AI municipal operations assistant. Write a concise, natural, officer-friendly daily briefing in 3 to 5 clear sentences for an officer opening their dashboard, based on the following live stats:
- Total Complaints: ${total}
- New complaints filed today: ${newToday}
- Critical priority complaints: ${critical} (${criticalSummary})
- Overdue complaints (>3 days old and unresolved): ${overdue}
- Resolved in the last 7 days: ${resolvedThisWeek}
- Top active categories: ${categorySummary || 'None'}
- Hotspot areas by citizen upvotes: ${hotspotSummary || 'None'}
- Average Citizen Satisfaction: ${avgSatisfaction !== null ? `${avgSatisfaction}/5` : 'No ratings yet'}

Requirements:
- Write exactly 3 to 5 plain-English sentences providing instant situational awareness.
- Highlight new intake, critical bottlenecks, hotspot areas, and recent resolution momentum.
- Do NOT use bullet points, headers, or markdown formatting.
- Do NOT use emojis.
- Start directly with the briefing text.`;

        const response = await anthropic.messages.create({
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 350,
          messages: [{ role: 'user', content: prompt }],
        });

        aiSummary = response.content[0]?.text?.trim() || '';
      } catch (aiErr) {
        console.error('Claude API briefing error, using fallback generator:', aiErr.message);
      }
    }

    // Use intelligent fallback if no API key or if API call timed out
    if (!aiSummary) {
      aiSummary = generateFallbackBriefing({
        total, newToday, overdue, resolvedThisWeek, critical, criticalItems,
        topCategories, hotspotAreas, avgSatisfaction,
      });
    }

    res.json({
      success: true,
      data: {
        total, newToday, overdue, resolvedThisWeek, critical,
        topCategories, hotspotAreas, avgSatisfaction, negativeFeedback, statusCounts,
        aiSummary,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getOfficerStats };
