function normalizeSeverity(value) {
  const severity = (value ?? 'High').toString().trim();
  if (severity.toLowerCase() === 'critical') return 'Critical';
  if (severity.toLowerCase() === 'high') return 'High';
  if (severity.toLowerCase() === 'medium') return 'Medium';
  if (severity.toLowerCase() === 'low') return 'Low';
  return severity || 'High';
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function createAiAnalysisPayload({ title, location, severity, description }) {
  const normalizedSeverity = normalizeSeverity(severity);
  const severityWeight = normalizedSeverity === 'Critical' ? 22 : normalizedSeverity === 'High' ? 16 : normalizedSeverity === 'Medium' ? 10 : 5;
  const titleWeight = Math.min(12, Math.max(2, (title ?? '').length % 7));
  const locationWeight = Math.min(8, Math.max(2, (location ?? '').length % 5));
  const descriptionWeight = Math.min(10, Math.max(2, (description ?? '').length % 6));
  const priorityScore = clamp(60 + severityWeight + titleWeight + locationWeight + descriptionWeight, 72, 98);

  const resources =
    normalizedSeverity === 'Critical'
      ? ['Fire and rescue command', 'Medical triage unit', 'Rapid evacuation team']
      : normalizedSeverity === 'High'
        ? ['Medical unit', 'Volunteer team', 'Safety crew']
        : normalizedSeverity === 'Medium'
          ? ['Community support desk', 'Volunteer responder', 'Logistics coordinator']
          : ['Community liaison', 'Local volunteer group', 'First aid support'];

  const safetyRecommendations =
    normalizedSeverity === 'Critical'
      ? ['Secure the perimeter immediately', 'Evacuate non-essential personnel', 'Maintain alternate access routes']
      : normalizedSeverity === 'High'
        ? ['Keep access lanes clear', 'Monitor for secondary hazards', 'Confirm responder staging areas']
        : normalizedSeverity === 'Medium'
          ? ['Document the scene clearly', 'Share updates with nearby teams', 'Prepare fallback support']
          : ['Keep observers at a safe distance', 'Log updates in the incident channel', 'Check for follow-on risks'];

  return {
    summary: `${title ?? 'Incident'} near ${location ?? 'the affected area'} requires rapid triage and coordinated support.`,
    severity: normalizedSeverity,
    priorityScore,
    resources,
    safetyRecommendations,
  };
}

module.exports = {
  createAiAnalysisPayload,
};
