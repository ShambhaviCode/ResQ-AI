const SEVERITIES = ['Critical', 'High', 'Medium', 'Low'];

// Each severity owns a non-overlapping score band, so a Critical incident
// always outranks a High one regardless of how it was worded.
const SEVERITY_BASE_SCORE = { Critical: 90, High: 80, Medium: 70, Low: 60 };
const MAX_KEYWORD_BONUS = 9;

// Signals that raise priority within a severity band.
const HIGH_RISK_KEYWORDS = [
  'trapped',
  'injured',
  'unconscious',
  'bleeding',
  'fire',
  'smoke',
  'explosion',
  'collapse',
  'flood',
  'gas leak',
  'children',
];

function normalizeSeverity(value) {
  const severity = (value ?? '').toString().trim().toLowerCase();
  return SEVERITIES.find((s) => s.toLowerCase() === severity) ?? 'High';
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function computePriorityScore(severity, text) {
  const haystack = (text ?? '').toLowerCase();
  const matches = HIGH_RISK_KEYWORDS.filter((keyword) => haystack.includes(keyword)).length;
  return SEVERITY_BASE_SCORE[severity] + Math.min(MAX_KEYWORD_BONUS, matches * 3);
}

function createAiAnalysisPayload({ title, location, severity, description }) {
  const normalizedSeverity = normalizeSeverity(severity);
  const priorityScore = computePriorityScore(normalizedSeverity, `${title ?? ''} ${description ?? ''}`);

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

function isStringList(value) {
  return Array.isArray(value) && value.length > 0 && value.every((item) => typeof item === 'string');
}

// Model output is untrusted: keep only well-formed fields and fall back to
// the local heuristic for anything missing or malformed.
function mergeModelAnalysis(parsed, fallback) {
  const model = parsed && typeof parsed === 'object' ? parsed : {};
  const score = Number(model.priorityScore);

  return {
    summary: typeof model.summary === 'string' && model.summary.trim() ? model.summary : fallback.summary,
    severity: typeof model.severity === 'string' ? normalizeSeverity(model.severity) : fallback.severity,
    priorityScore: Number.isFinite(score) ? Math.round(clamp(score, 0, 100)) : fallback.priorityScore,
    resources: isStringList(model.resources) ? model.resources : fallback.resources,
    safetyRecommendations: isStringList(model.safetyRecommendations)
      ? model.safetyRecommendations
      : fallback.safetyRecommendations,
  };
}

module.exports = {
  createAiAnalysisPayload,
  mergeModelAnalysis,
  normalizeSeverity,
};
