/**
 * Application shell: sidebar of exercises on the left, the current exercise and
 * its terminal on the right.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

import type {
  // Aliased: the component below is also called AlertQueue, and the surface is
  // the thing this file mostly refers to.
  AlertQueue as AlertQueueData,
  CopilotAnalysis,
  AssessmentReport as ReportData,
  Dimension,
  Evaluation,
  LaneProfile,
  AttackSuite,
  DefenceId,
  ModelCard,
  ProbeEntry,
  ProbeResult,
  BadgeDefinition,
  LobbyDoorId,
  ProgressOverview,
  PublicUser,
  DecisionSubmission,
  ScrollbackEntry,
  StudentDecisionPoint,
  TrackSummary,
  TriageEntry,
} from '@soc/shared';

import { AuthScreen } from './components/AuthScreen';
import { LearnPanel } from './components/LearnPanel';
import { PracticePanel } from './components/PracticePanel';
import { TrackPicker } from './components/TrackPicker';
import { Assessment } from './components/Assessment';
import { AssessmentReport } from './components/AssessmentReport';
import { LaneDetail } from './components/LaneDetail';
import { Terminal } from './components/Terminal';
import { AlertQueue } from './components/AlertQueue';
import { ModelLab } from './components/ModelLab';
import { WrittenAnswer } from './components/WrittenAnswer';
import { IncidentConsole } from './components/IncidentConsole';
import { MatchConsole } from './components/MatchConsole';
import { RoomBoard } from './components/RoomBoard';
import { Lobby } from './components/Lobby';
import { BadgeCase, BadgeToast } from './components/BadgeCase';
import { Home } from './components/Home';
import {
  ApiCallError,
  assessment,
  auth,
  learning,
  type ExerciseDetail,
  type LaneDetail as LaneDetailData,
  type PackageDetail,
  type SubmitResult,
} from './lib/api';

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
  /** The alert queue for a triage exercise, loaded alongside the exercise. */
  const [queue, setQueue] = useState<AlertQueueData | null>(null);
  /** Dispositions the student has assigned so far, held here so they survive re-render. */
  const [triage, setTriage] = useState<TriageEntry[]>([]);
  /** Per-alert explanation, released only once decisions are committed. */
  const [triageDebrief, setTriageDebrief] = useState<SubmitResult['triageDebrief'] | null>(null);
  /**
   * Copilot analyses the student has asked for, keyed by alert.
   *
   * Held here rather than in the queue component so that an answer already
   * fetched survives switching between alerts. Re-fetching would be a second
   * consultation of something they have already read, which is misleading in the
   * instructor's audit trail even though it cannot inflate the graded count.
   */
  const [copilotAnalyses, setCopilotAnalyses] = useState<Record<string, CopilotAnalysis>>({});
  const [copilotLoadingId, setCopilotLoadingId] = useState<string | null>(null);
  /**
   * Alerts already asked about, as the SERVER records them.
   *
   * Restored on load and refreshed from each answer, so a reload does not hide
   * consultations a student has already made: several exercises require a
   * minimum number, and they need to see where they stand.
   */
  const [consultedAlertIds, setConsultedAlertIds] = useState<string[]>([]);
  const [copilotError, setCopilotError] = useState<string | null>(null);
  /** Released with the debrief: which suggestions were unsound, and how. */
  const [copilotDebrief, setCopilotDebrief] = useState<SubmitResult['copilotDebrief'] | null>(null);
  const [collaboration, setCollaboration] = useState<SubmitResult['collaboration'] | null>(null);
  /** The decision point for an incident exercise, loaded alongside the exercise. */
  const [decisionPoint, setDecisionPoint] = useState<StudentDecisionPoint | null>(null);
  /**
   * What the student has picked so far at that decision point.
   *
   * Selection and ordering are held side by side rather than in one field,
   * because a point grades one axis or the other and keeping them separate means
   * switching exercises cannot leave a stray selection attached to an ordering.
   */
  const [decisionChoice, setDecisionChoice] = useState<{
    optionIds: string[];
    ordering: string[];
    justification: string;
  }>({ optionIds: [], ordering: [], justification: '' });
  /** Consequences of every option, released only once the student commits. */
  const [decisionOutcomes, setDecisionOutcomes] = useState<SubmitResult['decisionOutcomes'] | null>(
    null,
  );
  /** Errors from a non-terminal submission, which has no scrollback to print into. */
  const [submitError, setSubmitError] = useState<string | null>(null);
  /* --- the Model Lab -----------------------------------------------------
   *
   * The card and the suite arrive with the exercise; the probes and the defence
   * set are what the student is building. They live here rather than inside the
   * lab so that opening a practice drill, or a re-render, does not silently
   * discard work somebody spent twenty minutes on.
   */
  const [model, setModel] = useState<ModelCard | null>(null);
  const [attackSuite, setAttackSuite] = useState<AttackSuite | null>(null);
  const [probes, setProbes] = useState<ProbeEntry[]>([]);
  const [defences, setDefences] = useState<DefenceId[]>([]);
  const [probeResults, setProbeResults] = useState<ProbeResult[] | null>(null);
  const [hardening, setHardening] = useState<SubmitResult['hardening']>(undefined);
  const [postMortem, setPostMortem] = useState<string | null>(null);
  /** Set by "try again" so the next command is graded despite an earlier pass. */
  const [regrade, setRegrade] = useState(false);

  /**
   * Career Fit Analyzer view state.
   *
   * 'none' means the normal trainer. The analyzer is a distinct mode rather than
   * a modal, because it is a twenty-minute activity and deserves the whole screen.
   */
  const [careerView, setCareerView] = useState<'none' | 'quiz' | 'report' | 'lane'>('none');
  const [warRoom, setWarRoom] = useState(false);
  /*
   * The multi-seat SOC floor, which is a different product from the red versus
   * blue match: one incident, one seat each, and the seats come from the
   * scenario rather than from the role catalogue.
   */
  const [floor, setFloor] = useState(false);
  /*
   * The lobby, which is now the only way in to any war room.
   *
   * Every room needs several people at the same time, and before this existed
   * each of them arrived alone at an empty schedule ten minutes apart and
   * concluded the feature was dead. One shared room in front of all of them is
   * the fix. `lobbyHeading` carries which door somebody clicked to get here, so
   * the lobby can show that intent to everybody else standing in it.
   */
  const [inLobby, setInLobby] = useState(false);
  const [lobbyHeading, setLobbyHeading] = useState<LobbyDoorId | null>(null);
  const [badgeCase, setBadgeCase] = useState(false);
  /**
   * Badges a pass just earned, waiting to be shown.
   *
   * Carried on the pass response rather than polled, so the moment lands with
   * the pass instead of being discovered later on a shelf.
   */
  const [freshBadges, setFreshBadges] = useState<BadgeDefinition[]>([]);
  const [landing, setLanding] = useState(true);
  const [report, setReport] = useState<ReportData | null>(null);
  const [lanes, setLanes] = useState<LaneProfile[] | null>(null);
  const [laneDetail, setLaneDetail] = useState<LaneDetailData | null>(null);
  const [careerDimensions, setCareerDimensions] = useState<Array<{ dimension: Dimension; label: string }>>([]);

  /** Lane id -> title, so the report can name lanes without refetching each. */
  const laneTitles = useMemo(() => {
    const map: Record<string, string> = {};
    for (const lane of lanes ?? []) map[lane.id] = lane.title;
    return map;
  }, [lanes]);

  const openReport = useCallback(async () => {
    const [{ report: generated }, laneResult, stateResult] = await Promise.all([
      assessment.submit(),
      assessment.lanes(),
      assessment.state(),
    ]);
    setReport(generated);
    setLanes(laneResult.lanes);
    setCareerDimensions(stateResult.dimensions.map((d) => ({ dimension: d.dimension, label: d.label })));
    setCareerView('report');
  }, []);

  const openLane = useCallback(async (laneId: string) => {
    setLaneDetail(await assessment.lane(laneId));
    setCareerView('lane');
  }, []);

  /**
   * Picking a lane records it on the profile and switches the trainer to the
   * matching track. Lanes without a track yet fall back to the picker, rather
   * than silently doing nothing.
   */
  const chooseLaneTrack = useCallback(
    async (laneId: string) => {
      const detailResult = laneDetail?.lane.id === laneId ? laneDetail : await assessment.lane(laneId);
      const targetTrack = detailResult.track?.id ?? null;
      if (targetTrack) {
        await assessment.updateProfile({ chosenTrackId: targetTrack });
        setTrackId(targetTrack);
      } else {
        setTrackId(null);
      }
      setCareerView('none');
    },
    [laneDetail],
  );

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
        setExerciseId((current) => current ?? progressResult.resume?.exerciseId ?? 'linux.1.1');
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
    setQueue(null);
    setTriage([]);
    setTriageDebrief(null);
    setCopilotAnalyses({});
    setCopilotLoadingId(null);
    setConsultedAlertIds([]);
    setCopilotError(null);
    setCopilotDebrief(null);
    setCollaboration(null);
    setDecisionPoint(null);
    setDecisionChoice({ optionIds: [], ordering: [], justification: '' });
    setDecisionOutcomes(null);
    setSubmitError(null);
    setModel(null);
    setAttackSuite(null);
    setProbes([]);
    setDefences([]);
    setProbeResults(null);
    setHardening(undefined);
    setPostMortem(null);

    learning
      .exercise(exerciseId)
      .then((result) => {
        if (cancelled) return;
        setDetail(result);
        // Triage exercises need their queue before they can be worked. It is
        // fetched separately so the exercise payload stays the same shape for
        // every kind, and so a queue failure does not blank the whole screen.
        if (result.exercise.queueId) {
          learning
            .queue(exerciseId)
            .then((loaded) => {
              if (!cancelled) setQueue(loaded.queue);
            })
            .catch(() => {
              if (!cancelled) setSubmitError('The alert queue for this exercise could not be loaded.');
            });
        }
        // Model Lab exercises need a model card too, but that fetch lives in
        // its own effect below rather than here: the card depends on the active
        // practice drill as well as the exercise, because a drill may target a
        // different deployment.
        // Likewise for incident exercises: the decision point is fetched
        // separately so every exercise payload keeps the same shape.
        if (result.exercise.decisionPointId) {
          learning
            .decision(exerciseId)
            .then((loaded) => {
              if (!cancelled) setDecisionPoint(loaded.point);
            })
            .catch(() => {
              if (!cancelled) {
                setSubmitError('The decision point for this exercise could not be loaded.');
              }
            });
        }
        setScrollback(result.session.scrollback);
        setCwd(result.session.cwd);
        setLoadError(null);
        setHints(result.hints ?? []);
        setConsultedAlertIds(result.consultedAlertIds ?? []);
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

  /*
   * Reload the model card when a practice drill is selected or cleared.
   *
   * A Model Lab drill may target a DIFFERENT deployment from its parent -- "same
   * skill, different target" is the whole premise, and here the target is the
   * model. Without this the card would keep showing the parent's system while
   * probes went to the drill's, which is the one inconsistency in this surface
   * that would actively teach something false.
   */
  useEffect(() => {
    if (!exerciseId || !detail?.exercise.modelId) return;
    let cancelled = false;

    setProbes([]);
    setProbeResults(null);
    setHardening(undefined);
    setPostMortem(null);

    learning
      .model(exerciseId, practiceId ?? undefined)
      .then((loaded) => {
        if (cancelled) return;
        setModel(loaded.model);
        setAttackSuite(loaded.suite ?? null);
      })
      .catch(() => {
        if (!cancelled) setSubmitError('The model for this exercise could not be loaded.');
      });

    return () => {
      cancelled = true;
    };
  }, [exerciseId, practiceId, detail?.exercise.modelId]);

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

  /**
   * Ask the copilot about one alert.
   *
   * One request per alert, made only when the student clicks, because the server
   * records the asking and several exercises grade it. An already-fetched
   * analysis is served from state rather than re-requested: the student has read
   * it, and a second request would misreport them in the instructor's audit
   * trail as having gone back to it.
   */
  const askCopilot = async (alertId: string) => {
    if (!exerciseId || copilotAnalyses[alertId]) return;
    setCopilotLoadingId(alertId);
    setCopilotError(null);
    try {
      const result = await learning.copilot(exerciseId, alertId);
      setCopilotAnalyses((current) => ({ ...current, [alertId]: result.analysis }));
      setConsultedAlertIds(result.consultedAlertIds);
    } catch (error) {
      setCopilotError(
        error instanceof ApiCallError ? error.error.message : 'The copilot could not be reached.',
      );
    } finally {
      setCopilotLoadingId(null);
    }
  };

  /** The copilot debrief keyed by alert, so the panel can find its own entry. */
  const copilotDebriefByAlert = useMemo(() => {
    const byAlert: Record<string, NonNullable<SubmitResult['copilotDebrief']>[number]> = {};
    for (const entry of copilotDebrief ?? []) byAlert[entry.alertId] = entry;
    return byAlert;
  }, [copilotDebrief]);

  /**
   * Answer an exercise that is not worked in the terminal.
   *
   * Triage, multiple-choice, and short-answer share one path, because all three
   * are graded against the submission rather than against filesystem state.
   */
  const submit = async (answer: {
    selectedOptionIds?: string[];
    answerText?: string;
    triage?: TriageEntry[];
    decision?: DecisionSubmission;
    probes?: ProbeEntry[];
    defences?: DefenceId[];
  }) => {
    if (!exerciseId) return;
    setBusy(true);
    setSubmitError(null);
    try {
      const result = await learning.submitAnswer(exerciseId, answer, {
        ...(practiceId ? { practiceId } : {}),
        ...(regrade ? { regrade: true } : {}),
      });
      setEvaluation(result.evaluation);
      setTriageDebrief(result.triageDebrief ?? null);
      setCopilotDebrief(result.copilotDebrief ?? null);
      setCollaboration(result.collaboration ?? null);
      setDecisionOutcomes(result.decisionOutcomes ?? null);
      setProbeResults(result.probeResults ?? null);
      setHardening(result.hardening);
      setPostMortem(result.postMortem ?? null);
      if (result.earnedBadges?.length) setFreshBadges(result.earnedBadges);
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
      }
    } catch (error) {
      setSubmitError(
        error instanceof ApiCallError ? error.error.message : 'That answer could not be sent.',
      );
    } finally {
      setBusy(false);
    }
  };

  /**
   * Fire one payload at the model without being graded.
   *
   * Deliberately does not touch `evaluation`, `busy` beyond the request, or any
   * progress state. Probing is testing, testing is mostly failure, and nothing
   * about a failed probe should look or feel like a failed attempt.
   */
  const sendProbe = async (probe: ProbeEntry): Promise<ProbeResult | null> => {
    if (!exerciseId) return null;
    const result = await learning.probe(exerciseId, [probe], {
      ...(defences.length > 0 ? { defences } : {}),
      ...(practiceId ? { practiceId } : {}),
    });
    return result.results[0] ?? null;
  };

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

      if (result.earnedBadges?.length) setFreshBadges(result.earnedBadges);

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

  /*
   * The Career Fit Analyzer takes over the whole screen when active. It is a
   * twenty-minute activity, not a dialog, and squeezing it into a modal beside
   * the terminal would make it feel like a formality rather than the thing that
   * decides what somebody studies for the next year.
   */
  if (badgeCase) {
    return (
      <div className="floorshell">
        <BadgeCase onBack={() => setBadgeCase(false)} />
      </div>
    );
  }

  /*
   * The lobby sits in front of every war room, so leaving one goes back to it
   * rather than to the landing map: somebody who has just finished a session is
   * far more likely to want the next one than to want the home page.
   */
  if (inLobby) {
    return (
      <Lobby
        initialHeading={lobbyHeading}
        onSocFloor={() => {
          setInLobby(false);
          setFloor(true);
        }}
        onRedBlue={() => {
          setInLobby(false);
          setWarRoom(true);
        }}
        onExit={() => {
          setInLobby(false);
          setLobbyHeading(null);
          setLanding(true);
        }}
      />
    );
  }

  if (floor) {
    return (
      <div className="floorshell">
        <button type="button" className="linkish" onClick={() => { setFloor(false); setInLobby(true); }}>
          ← Back to the lobby
        </button>
        <RoomBoard />
      </div>
    );
  }

  if (warRoom) {
    return (
      <MatchConsole
        user={user}
        onExit={() => {
          setWarRoom(false);
          setInLobby(true);
        }}
      />
    );
  }

  if (landing) {
    return (
      <Home
        username={user.username}
        paid={user.tier === 'paid'}
        onSignOut={signOut}
        onTakeAssessment={() => {
          setLanding(false);
          setCareerView('quiz');
        }}
        onRisk={() => setLanding(false)}
        onLinux={() => setLanding(false)}
        onSoc={() => setLanding(false)}
        onBrowseTracks={() => setLanding(false)}
        onLobby={(door) => {
          // Every war room tile lands here. The door somebody pressed rides
          // along so the lobby can show that intent to the other people in it,
          // which is the entire point of putting one room in front of four.
          setLanding(false);
          setLobbyHeading(door);
          setInLobby(true);
        }}
        onBadges={() => {
          setLanding(false);
          setBadgeCase(true);
        }}
        onPortfolio={() => setLanding(false)}
        onInterviewSim={() => setLanding(false)}
        onInterviewPeer={() => setLanding(false)}
      />
    );
  }

  if (careerView === 'quiz') {
    return (
      <div className="app">
        <CareerTopBar user={user} onSignOut={signOut} onExit={() => setCareerView('none')} />
        <Assessment onComplete={openReport} onExit={() => setCareerView('none')} />
      </div>
    );
  }

  if (careerView === 'report' && report) {
    return (
      <div className="app">
        <CareerTopBar user={user} onSignOut={signOut} onExit={() => setCareerView('none')} />
        <AssessmentReport
          report={report}
          laneTitles={laneTitles}
          dimensions={careerDimensions}
          onOpenLane={openLane}
          onChooseTrack={chooseLaneTrack}
          onRetakeDimension={async (dimension) => {
            await assessment.retake(dimension);
            setCareerView('quiz');
          }}
        />
      </div>
    );
  }

  if (careerView === 'lane' && laneDetail) {
    return (
      <div className="app">
        <CareerTopBar user={user} onSignOut={signOut} onExit={() => setCareerView('none')} />
        <LaneDetail
          lane={laneDetail.lane}
          certifications={laneDetail.certifications}
          certPhilosophy={laneDetail.certPhilosophy}
          track={laneDetail.track}
          foundations={laneDetail.foundations}
          readiness={laneDetail.readiness}
          onBack={() => setCareerView(report ? 'report' : 'none')}
          onChoose={() => chooseLaneTrack(laneDetail.lane.id)}
        />
      </div>
    );
  }

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
          <div className="picker-with-quiz">
            <aside className="quiz-invite">
              <h2>Not sure which one?</h2>
              <p>
                Answer some questions about how you like to work, and we will suggest which of the
                fourteen security career paths fit you, and which would make you miserable.
              </p>
              <button type="button" className="primary" onClick={() => setCareerView('quiz')}>
                Take the Career Fit Analyzer
              </button>
              <p className="muted small">
                About 20 minutes. Your answers save as you go, so you can stop and come back.
              </p>
            </aside>
            <TrackPicker tracks={tracks} activeTrackId={trackId} onChoose={setTrackId} />
          </div>
        </div>
      );
  }

  return (
    <div className="app">
      {/* Fires the instant a pass completes a package or a track. Rendered at
          the shell so it is not clipped by whichever panel was open. */}
      <BadgeToast badges={freshBadges} onDismiss={() => setFreshBadges([])} />
      <header className="topbar">
        <span className="brand">
          <span className="dot" />
          Ridgeline SOC Trainer
        </span>
        <button className="btn link iconbtn" title="Home" aria-label="Home" onClick={() => setLanding(true)}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 11l9-8 9 8" />
            <path d="M5 10v10h14V10" />
          </svg>
        </button>
        <button className="btn link iconbtn" title="Career fit" aria-label="Career fit" onClick={() => setCareerView('quiz')}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M15.5 8.5l-2.2 4.8-4.8 2.2 2.2-4.8z" />
          </svg>
        </button>
        <button className="btn link iconbtn" title="Badges" aria-label="Badges" onClick={() => setBadgeCase(true)}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="9" r="6" />
            <path d="M8.5 14.5L7 22l5-2.5L17 22l-1.5-7.5" />
          </svg>
        </button>
        <button className="btn link iconbtn" title="Lobby" aria-label="Lobby" onClick={() => setInLobby(true)}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l7 3v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6z" />
          </svg>
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
                        {regrade ? 'Go ahead: type your answer' : 'Try it again'}
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

              {submitError && <p className="feedback fail">{submitError}</p>}

              {detail.exercise.kind === 'terminal' ? (
                <Terminal
                  scrollback={scrollback}
                  cwd={cwd}
                  busy={busy}
                  prefill={prefill}
                  onPrefillConsumed={() => setPrefill(null)}
                  onRun={run}
                  onReset={reset}
                />
              ) : detail.exercise.kind === 'alert-triage' ? (
                queue ? (
                  <AlertQueue
                    queue={queue}
                    entries={triage}
                    onChange={setTriage}
                    onSubmit={() => submit({ triage })}
                    busy={busy}
                    {...(triageDebrief ? { debrief: triageDebrief } : {})}
                    {...(detail.exercise.copilotEnabled
                      ? {
                          copilot: {
                            analyses: copilotAnalyses,
                            consultedAlertIds,
                            loadingAlertId: copilotLoadingId,
                            error: copilotError,
                            onAsk: askCopilot,
                            ...(copilotDebrief ? { debriefByAlert: copilotDebriefByAlert } : {}),
                            ...(collaboration ? { collaboration } : {}),
                          },
                        }
                      : {})}
                  />
                ) : (
                  <p className="centered-note">Loading the queue…</p>
                )
              ) : detail.exercise.kind === 'model-probe' ? (
                model ? (
                  <ModelLab
                    model={model}
                    {...(attackSuite ? { suite: attackSuite } : {})}
                    {...(detail.exercise.defencesConfigurable ? { configurable: true } : {})}
                    probes={probes}
                    onChangeProbes={setProbes}
                    defences={defences}
                    onChangeDefences={setDefences}
                    onSend={sendProbe}
                    onSubmit={() =>
                      submit({
                        probes,
                        // Only sent when the exercise lets the student rebuild
                        // the deployment. Sending an empty array on a discovery
                        // exercise would mean "run this with no controls at
                        // all", which is a very different request from "test it
                        // as it stands".
                        ...(detail.exercise.defencesConfigurable ? { defences } : {}),
                      })
                    }
                    busy={busy}
                    {...(probeResults ? { submitted: probeResults } : {})}
                    {...(hardening ? { hardening } : {})}
                    {...(postMortem ? { postMortem } : {})}
                  />
                ) : (
                  <p className="centered-note">Loading the model…</p>
                )
              ) : detail.exercise.kind === 'incident-decision' ? (
                decisionPoint ? (
                  <IncidentConsole
                    point={decisionPoint}
                    optionIds={decisionChoice.optionIds}
                    ordering={decisionChoice.ordering}
                    justification={decisionChoice.justification}
                    onChange={(next) =>
                      setDecisionChoice((current) => ({ ...current, ...next }))
                    }
                    onSubmit={() =>
                      submit({
                        decision: {
                          // Send only the axis this point actually grades, so an
                          // ordering exercise never arrives carrying a stray
                          // selection from a previous attempt.
                          ...(decisionPoint.ordered
                            ? { ordering: decisionChoice.ordering }
                            : { optionIds: decisionChoice.optionIds }),
                          ...(decisionChoice.justification
                            ? { justification: decisionChoice.justification }
                            : {}),
                        },
                      })
                    }
                    busy={busy}
                    {...(decisionOutcomes ? { outcomes: decisionOutcomes } : {})}
                  />
                ) : (
                  <p className="centered-note">Loading the incident…</p>
                )
              ) : (
                <WrittenAnswer
                  /* A drill can need a different surface from its parent: a
                     drill on a multiple-choice exercise is usually free text,
                     which is what removes the guess floor. Rendering the
                     parent's checkboxes there made those drills unanswerable. */
                  kind={activePractice?.kind ?? detail.exercise.kind}
                  options={activePractice ? [] : (detail.exercise.options ?? [])}
                  busy={busy}
                  onSubmit={submit}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

/**
 * Top bar for the Career Fit Analyzer screens.
 *
 * Kept separate from the trainer's top bar because the analyzer has no track,
 * no exercise, and no progress figure to show -- reusing that bar would leave
 * three empty slots.
 */
function CareerTopBar({
  user,
  onSignOut,
  onExit,
}: {
  user: PublicUser;
  onSignOut: () => void;
  onExit: () => void;
}) {
  return (
    <header className="topbar">
      <span className="brand">
        <span className="dot" />
        Ridgeline SOC Trainer
      </span>
      <button className="btn link" onClick={onExit}>
        Back to training
      </button>
      <span className="spacer" />
      <span className="who">{user.username}</span>
      <button className="btn" onClick={onSignOut}>
        Sign out
      </button>
    </header>
  );
}
