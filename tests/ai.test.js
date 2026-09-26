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

const { mergeModelAnalysis, normalizeSeverity } = require('../lib/ai');

test('priority bands never overlap across severities', () => {
  const quiet = { title: 'Noise complaint', location: 'Block C', description: 'Loud music' };
  const alarming = {
    title: 'Fire with people trapped',
    location: 'Harbor District',
    description: 'Explosion, smoke, injured and unconscious children, building collapse, gas leak, flood',
  };
  const order = ['Critical', 'High', 'Medium', 'Low'];

  for (let i = 0; i < order.length - 1; i++) {
    const higherFloor = createAiAnalysisPayload({ ...quiet, severity: order[i] }).priorityScore;
    const lowerCeiling = createAiAnalysisPayload({ ...alarming, severity: order[i + 1] }).priorityScore;
    assert.ok(higherFloor > lowerCeiling, `${order[i]} ${higherFloor} should beat ${order[i + 1]} ${lowerCeiling}`);
  }
});

test('risk keywords raise priority within the band', () => {
  const base = createAiAnalysisPayload({ title: 'Incident', severity: 'High' }).priorityScore;
  const risky = createAiAnalysisPayload({ title: 'Person trapped', description: 'injured', severity: 'High' }).priorityScore;
  assert.ok(risky > base);
  assert.ok(risky < 90);
});

test('unknown severities fall back to High instead of passing through', () => {
  assert.equal(normalizeSeverity('extreme'), 'High');
  assert.equal(normalizeSeverity(undefined), 'High');
  assert.equal(normalizeSeverity(' low '), 'Low');
});

test('model output is validated before use', () => {
  const fallback = createAiAnalysisPayload({ title: 'Flood', location: 'Riverside', severity: 'Medium' });

  const merged = mergeModelAnalysis(
    { summary: '', severity: 'critical', priorityScore: 'very high', resources: 'boats', safetyRecommendations: [1, 2] },
    fallback,
  );
  assert.equal(merged.summary, fallback.summary);
  assert.equal(merged.severity, 'Critical');
  assert.equal(merged.priorityScore, fallback.priorityScore);
  assert.deepEqual(merged.resources, fallback.resources);
  assert.deepEqual(merged.safetyRecommendations, fallback.safetyRecommendations);

  assert.equal(mergeModelAnalysis({ priorityScore: 250 }, fallback).priorityScore, 100);
  assert.equal(mergeModelAnalysis({ priorityScore: '87.6' }, fallback).priorityScore, 88);
  assert.deepEqual(mergeModelAnalysis(null, fallback), fallback);
});
