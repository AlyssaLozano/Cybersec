/**
 * Application shell: sidebar of exercises on the left, the current exercise and
 * its terminal on the right.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

import type {
  Evaluation,
  ProgressOverview,
  PublicUser,
  ScrollbackEntry,
  TrackSummary,
} from '@soc/shared';

import { AuthScreen } from './components/AuthScreen';
import { LearnPanel } from './components/LearnPanel';
import { PracticePanel } from './components/PracticePanel';
import { TrackPicker } from './components/TrackPicker';
import { Terminal } from './components/Terminal';
import { ApiCallError, auth, learning, type ExerciseDetail, type PackageDetail } from './lib/api';

export function App() {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    auth
      .me()
      .then((result) => setUser(result.user))
      .catch(() => setUser(null))
      .finally(() => setCheckingSession(false));
  }, []);

  if (checkingSession) {
    return <div className="centered-note">Loading…</div>;
  }

  if (!user) {
    return <AuthScreen onSignedIn={setUser} />;
  }

  return <Trainer user={user} onSignedOut={() => setUser(null)} />;
}

function Trainer({ user, onSignedOut }: { user: PublicUser; onSignedOut: () => void }) {
  const [pkg, setPkg] = useState<PackageDetail | null>(null);
  const [progress, setProgress] = useState<ProgressOverview | null>(null);
  const [exerciseId, setExerciseId] = useState<string | null>(null);
  const [detail, setDetail] = useState<ExerciseDetail | null>(null);

  const [scrollback, setScrollback] = useState<ScrollbackEntry[]>([]);
  const [cwd, setCwd] = useState('/home/student');
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [reveal, setReveal] = useState<{ solution?: string; expectedOutput?: string; debrief?: string }>({});
  const [busy, setBusy] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [hints, setHints] = useState<string[]>([]);
  /** Text pushed into the terminal input when a student clicks an example. */
  const [prefill, setPrefill] = useState<string | null>(null);
  const [tracks, setTracks] = useState<TrackSummary[] | null>(null);
  /** Null until a track is chosen, which is what the picker screen keys off. */
  const [trackId, setTrackId] = useState<string | null>(null);
  /** The drill currently being graded, or null when working the exercise. */
  const [practiceId, setPracticeId] = useState<string | null>(null);
  /** Set by "try again" so the next command is graded despite an earlier pass. */
  const [regrade, setRegrade] = useState(false);

  const refreshProgress = useCallback(async () => {
    setProgress(await learning.progress());
  }, []);

  /**
   * A student who has already made progress has already chosen a track, so send
   * them straight back to it rather than asking again every visit. Done in an
   * effect rather than during render, which React does not allow.
   */
  const autoSelectedTrack = tracks?.some((track) => track.passedCount > 0) ?? false;
  useEffect(() => {
    if (trackId !== null || !tracks) return;
    const started = tracks.find((track) => track.passedCount > 0);
    if (started) setTrackId(started.id);
  }, [tracks, trackId]);

  // Load the catalogue, then jump to wherever the student left off.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [detailResult, progressResult, trackResult] = await Promise.all([
          learning.packageDetail('1'),
          learning.progress(),
          learning.tracks(),
        ]);
        if (cancelled) return;
        setPkg(detailResult);
        setProgress(progressResult);
        setTracks(trackResult.tracks);
        setExerciseId((current) => current ?? progressResult.resume?.exerciseId ?? '1.1.1');
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof ApiCallError ? error.error.message : 'Could not load the course.');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Load whichever exercise is selected.
  useEffect(() => {
    if (!exerciseId) return;
    let cancelled = false;

    setEvaluation(null);
    setReveal({});
    setHints([]);
    setPrefill(null);
    setPracticeId(null);
    setRegrade(false);

    learning
      .exercise(exerciseId)
      .then((result) => {
        if (cancelled) return;
        setDetail(result);
        setScrollback(result.session.scrollback);
        setCwd(result.session.cwd);
        setLoadError(null);
        setHints(result.hints ?? []);
        if (result.solution) {
          setReveal({
            solution: result.solution,
            expectedOutput: result.expectedOutput,
            debrief: result.debrief,
          });
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setLoadError(error instanceof ApiCallError ? error.error.message : 'Could not load that exercise.');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [exerciseId]);

  const passedIds = useMemo(() => {
    const ids = new Set<string>();
    for (const packageProgress of progress?.packages ?? []) {
      for (const module of packageProgress.modules) {
        for (const exercise of module.exercises) {
          if (exercise.status === 'passed') ids.add(exercise.exerciseId);
        }
      }
    }
    return ids;
  }, [progress]);

  /** Ordered ids, used to decide which exercises are unlocked. */
  const orderedIds = useMemo(
    () => pkg?.modules.flatMap((module) => module.exercises.map((exercise) => exercise.id)) ?? [],
    [pkg],
  );

  const firstUnpassedIndex = orderedIds.findIndex((id) => !passedIds.has(id));
  const unlockedThrough = firstUnpassedIndex === -1 ? orderedIds.length - 1 : firstUnpassedIndex;

  const run = async (input: string) => {
    if (!exerciseId) return;
    setBusy(true);
    try {
      const result = await learning.run(exerciseId, input, {
        ...(practiceId ? { practiceId } : {}),
        ...(regrade ? { regrade: true } : {}),
      });
      setScrollback((previous) => [
        ...previous,
        { kind: 'command', text: input, cwd },
        ...(result.output ? [{ kind: 'output' as const, text: result.output, exitCode: result.exitCode }] : []),
      ]);
      setCwd(result.cwd);

      if (result.evaluation) {
        setEvaluation(result.evaluation);
        // A single "try again" grades one command, then stands down.
        if (regrade) setRegrade(false);
        if (result.evaluation.passed) {
          if (!practiceId) {
            setReveal({
              solution: result.solution,
              expectedOutput: result.expectedOutput,
              debrief: result.debrief,
            });
          }
          await refreshProgress();
          // Refresh drill ticks without disturbing the terminal scrollback.
          if (practiceId && exerciseId) {
            const refreshed = await learning.exercise(exerciseId);
            setDetail((current) =>
              current ? { ...current, practiceState: refreshed.practiceState } : current,
            );
          }
        }
      }
    } catch (error) {
      const message = error instanceof ApiCallError ? error.error.message : 'The command could not be sent.';
      setScrollback((previous) => [...previous, { kind: 'system', text: message }]);
    } finally {
      setBusy(false);
    }
  };

  const reset = async () => {
    if (!exerciseId) return;
    setBusy(true);
    try {
      const result = await learning.reset(exerciseId);
      setScrollback(result.session.scrollback);
      setCwd(result.session.cwd);
      setEvaluation(null);
    } finally {
      setBusy(false);
    }
  };

  const requestHint = async () => {
    if (!exerciseId) return;
    setBusy(true);
    try {
      const result = await learning.hint(exerciseId);
      setHints(result.hints);
    } finally {
      setBusy(false);
    }
  };

  const requestSolution = async () => {
    if (!exerciseId) return;
    setBusy(true);
    try {
      const result = await learning.solution(exerciseId);
      setReveal((previous) => ({ ...previous, solution: result.solution, expectedOutput: result.expectedOutput }));
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    await auth.logout();
    onSignedOut();
  };

  const packageProgress = progress?.packages[0];
  const alreadyPassed = exerciseId ? passedIds.has(exerciseId) : false;
  const activePractice = practiceId
    ? (detail?.practice.find((item) => item.id === practiceId) ?? null)
    : null;

  // Choose a track before anything else. Skipped automatically on later visits,
  // because a student who has already started has already chosen.
  if (tracks && trackId === null && !autoSelectedTrack) {
    return (
        <div className="app">
          <header className="topbar">
            <span className="brand">
              <span className="dot" />
              Ridgeline SOC Trainer
            </span>
            <span className="spacer" />
            <span className="who">{user.username}</span>
            <button className="btn" onClick={signOut}>
              Sign out
            </button>
          </header>
          <TrackPicker tracks={tracks} activeTrackId={trackId} onChoose={setTrackId} />
        </div>
      );
  }

  return (
    <div className="app">
      <header className="topbar">
        <span className="brand">
          <span className="dot" />
          Ridgeline SOC Trainer
        </span>
        <button className="btn link" onClick={() => setTrackId(null)}>
          All tracks
        </button>
        <span className="spacer" />
        <span className="who">
          {user.username}
          {packageProgress && (
            <> · {packageProgress.passedCount}/{packageProgress.exerciseCount} complete</>
          )}
        </span>
        <button className="btn" onClick={signOut}>
          Sign out
        </button>
      </header>

      <div className="layout">
        <nav className="sidebar">
          {pkg && (
            <div className="pkg-header">
              <div className="title">{pkg.title}</div>
              <div className="summary">{pkg.summary}</div>
              <div className="progress-bar">
                <span style={{ width: `${packageProgress?.percentComplete ?? 0}%` }} />
              </div>
              <div className="progress-label">
                {packageProgress?.passedCount ?? 0} of {packageProgress?.exerciseCount ?? 0} exercises passed
              </div>
            </div>
          )}

          {pkg?.modules.map((module) => (
            <div className="module" key={module.id}>
              <div className="name">
                {module.id} · {module.title}
              </div>
              {module.exercises.map((exercise) => {
                const done = passedIds.has(exercise.id);
                const locked = orderedIds.indexOf(exercise.id) > unlockedThrough;
                return (
                  <button
                    key={exercise.id}
                    className={`ex-item${exercise.id === exerciseId ? ' active' : ''}`}
                    disabled={locked}
                    title={locked ? 'Finish the earlier exercises first' : exercise.title}
                    onClick={() => setExerciseId(exercise.id)}
                  >
                    <span className={`mark${done ? ' done' : locked ? ' locked' : ''}`}>{done ? '✓' : ''}</span>
                    <span className="label">{exercise.title}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <main className="pane">
          {loadError && <div className="centered-note">{loadError}</div>}

          {!loadError && detail && (
            <>
              <section className="brief">
                <div className="eyebrow">
                  Exercise {detail.exercise.id} · {detail.exercise.kind === 'terminal' ? 'Terminal' : detail.exercise.kind}
                </div>
                <h1>{detail.exercise.title}</h1>
                <div className="goal">{detail.exercise.goal}</div>
                <div className="prompt">
                  {activePractice ? activePractice.prompt : detail.exercise.prompt}
                </div>

                <LearnPanel
                  key={detail.exercise.id}
                  teach={detail.exercise.teach}
                  hints={hints}
                  hintCount={detail.exercise.hintCount}
                  solution={reveal.solution}
                  startCollapsed={alreadyPassed}
                  busy={busy}
                  onRequestHint={requestHint}
                  onRequestSolution={requestSolution}
                  onTryExample={setPrefill}
                />

                {evaluation && (
                  <div className={`feedback ${evaluation.passed ? 'pass' : 'fail'}`}>
                    <div className="head">
                      {evaluation.passed ? '✓' : '✗'} {evaluation.summary}
                    </div>
                    {evaluation.failed.length > 0 && (
                      <ul>
                        {evaluation.failed.map((failure, index) => (
                          <li key={index}>{failure.hint}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {(alreadyPassed || evaluation?.passed) && reveal.debrief && (
                  <div className={`feedback pass`}>
                    <div className="head">✓ Passed</div>
                    {reveal.solution && (
                      <div className="solution-row">
                        Worked answer: <code>{reveal.solution}</code>
                      </div>
                    )}
                    <div className="debrief">
                      <span className="tag">Why this matters</span>
                      {reveal.debrief}
                    </div>
                    <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {detail.nextExerciseId && (
                        <button className="btn primary" onClick={() => setExerciseId(detail.nextExerciseId!)}>
                          Next exercise →
                        </button>
                      )}
                      <button
                        className="btn"
                        disabled={regrade}
                        title="Grade your next command against this exercise again"
                        onClick={() => {
                          setRegrade(true);
                          setPracticeId(null);
                          setEvaluation(null);
                        }}
                      >
                        {regrade ? 'Go ahead — type your answer' : 'Try it again'}
                      </button>
                    </div>
                  </div>
                )}

                {(alreadyPassed || evaluation?.passed) && (
                  <PracticePanel
                    practice={detail.practice}
                    state={detail.practiceState}
                    activeId={practiceId}
                    onSelect={(id) => {
                      setPracticeId(id);
                      setEvaluation(null);
                      setRegrade(false);
                    }}
                  />
                )}
              </section>

              <Terminal
                scrollback={scrollback}
                cwd={cwd}
                busy={busy}
                prefill={prefill}
                onPrefillConsumed={() => setPrefill(null)}
                onRun={run}
                onReset={reset}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
