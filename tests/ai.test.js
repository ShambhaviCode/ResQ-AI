const assert = require('node:assert/strict');
const test = require('node:test');

const { createAiAnalysisPayload } = require('../lib/ai');

test('creates a structured AI analysis payload with fallback resources', () => {
  const analysis = createAiAnalysisPayload({
    title: 'Warehouse fire',
    location: 'Harbor District',
    severity: 'Critical',
  });

  assert.equal(analysis.severity, 'Critical');
  assert.ok(analysis.priorityScore >= 85);
  assert.ok(Array.isArray(analysis.resources));
  assert.ok(analysis.resources.length > 0);
  assert.ok(Array.isArray(analysis.safetyRecommendations));
});
