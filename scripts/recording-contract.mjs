import assert from 'node:assert/strict';

const changeInventory = {
  drift: [
    'naiveReleasedUnverifiedBytes',
    'postHocCheck',
    'boundApply',
    'releasedExactlyVerifiedCommit',
    'releasedSourceUnchanged',
  ],
  empty: [
    'checkerExit',
    'approvalDecision',
    'releaseUnchanged',
    'candidateControlledCompiler',
    'trustedCompiler',
    'weakenedPolicyDecision',
    'weakPolicyRefUnchanged',
  ],
  stale: ['reusedEvidence', 'expiryBoundary', 'releaseUnchanged'],
  competing: ['acknowledgedWinners', 'observedWinners', 'observedConflicts'],
  'lost-ack': [
    'faultWindowReached',
    'callerAcknowledgement',
    'executorTerminated',
    'reconciliation',
    'replayNotApplied',
    'releaseStillCandidate',
  ],
};
const intentInventory = [
  'fresh-key',
  'same-intent',
  'late-commit',
  'conflicting-command',
  'crash-before',
  'crash-after',
  'two-processes',
];
const cancellationInventory = {
  'timeout-only': 'timeouts-leave-overlapping-work',
  'early-release': 'permit-count-can-lie-about-work',
  'admission-only': 'noncooperative-work-stays-bounded-but-remains-active',
  cooperative: 'cooperative-work-stops-and-keeps-permit-until-settlement',
};
const cancellationCommon = [
  'attempt-1-partial-data',
  'attempt-2-partial-data',
  'attempt-3-partial-data',
  'attempt-4-partial-data',
  'raw-event-bookkeeping',
  'all-work-drained',
];
const exact = (actual, expected, label) =>
  assert.deepEqual([...actual].sort(), [...expected].sort(), label);

/** Import contract for known local recordings, not a cryptographic attestation or rerun of the experiment. */
export function validateRecording(id, evidence, revision) {
  if (id === 'cancellation') {
    assert.equal(evidence.version, 1, 'cancellation: unsupported report version');
    assert.equal(evidence.source.git.head, revision, 'cancellation: unexpected source revision');
    assert.equal(evidence.source.git.dirty, false, 'cancellation: dirty source');
    assert.equal(evidence.sourceUnchanged, true, 'cancellation: source changed during execution');
    assert.equal(evidence.passed, true, 'cancellation: failed run');
    exact(
      evidence.cases.map((item) => item.mode),
      Object.keys(cancellationInventory),
      'cancellation: incomplete policy inventory',
    );
    for (const item of evidence.cases) {
      assert.equal(item.passed, true, 'cancellation/' + item.mode + ': failed policy');
      exact(
        item.checks.map((check) => check.name),
        [...cancellationCommon, cancellationInventory[item.mode]],
        'cancellation/' + item.mode + ': incomplete check inventory',
      );
      assert.ok(
        item.checks.every((check) => check.passed === true),
        'cancellation/' + item.mode + ': failed check',
      );
    }
    return;
  }
  if (id === 'intent') {
    assert.equal(evidence.sourceBefore.git.head, revision, 'intent: unexpected source revision');
    assert.equal(evidence.sourceBefore.git.dirty, false, 'intent: dirty source');
    assert.equal(
      evidence.sourceAfter.git.head,
      revision,
      'intent: revision changed during execution',
    );
    assert.equal(evidence.sourceAfter.git.dirty, false, 'intent: source ended dirty');
    assert.equal(
      evidence.sourceBefore.sha256,
      evidence.sourceAfter.sha256,
      'intent: source fingerprint changed',
    );
    assert.equal(evidence.sourceStable, true);
    assert.equal(evidence.passed, true);
    exact(
      evidence.scenarios.map((item) => item.id),
      intentInventory,
      'intent: incomplete scenario inventory',
    );
    assert.ok(
      evidence.scenarios.every((item) => item.passed === true),
      'intent: failed scenario',
    );
    return;
  }
  assert.equal(id, 'change', 'Unsupported recording kind');
  assert.equal(evidence.provenance.gitRevision, revision, 'change: unexpected source revision');
  assert.equal(evidence.provenance.gitDirty, false, 'change: dirty source');
  exact(
    evidence.cases.map((item) => item.id),
    Object.keys(changeInventory),
    'change: incomplete case inventory',
  );
  for (const item of evidence.cases) {
    exact(
      item.observations.map((observation) => observation.key),
      changeInventory[item.id],
      'change/' + item.id + ': incomplete observation inventory',
    );
    assert.ok(
      item.observations.every((observation) => observation.passed === true),
      'change/' + item.id + ': failed observation',
    );
  }
}
