/**
 * Career Fit Analyzer routes.
 *
 * The item bank ships to the client WITHOUT its scoring weights. A learner who
 * can see that agreeing with item e1 adds four points to penetration testing can
 * work backwards to whatever answer they wanted, which turns a self-assessment
 * into a wish list. Scoring stays on the server for the same reason exercise
 * checks do.
 */

import { Router } from 'express';
import { z } from 'zod';

import { API_ERROR_CODES, DIMENSIONS } from '@soc/shared';
import type { AssessmentItem } from '@soc/shared';

import { ITEMS } from '../content/assessment/items.js';
import { shareableSummary } from '../content/assessment/report.js';
import { CERT_PHILOSOPHY, resolveCertifications } from '../content/certifications.js';
import { trackFoundations, trackReadiness } from '../content/curriculum.js';
import { getLaneProfile, LANE_PROFILES } from '../content/lanes.js';
import { getTrack } from '../content/tracks.js';
import { TOOL_PHILOSOPHY } from '../content/tools.js';
import { asyncRoute, HttpError, requireAuth, sendOk } from '../http.js';
import {
  getProfile,
  getState,
  resetAssessment,
  retakeDimension,
  saveResponses,
  submit,
  updateProfile,
} from '../services/assessment.js';

export const assessmentRouter = Router();

assessmentRouter.use(requireAuth);

function userIdOf(request: { session?: { sub: string } }): string {
  const id = request.session?.sub;
  if (!id) throw new HttpError(401, API_ERROR_CODES.unauthenticated, 'Not signed in.');
  return id;
}

/**
 * Strip scoring weights from an item before sending it to the browser.
 *
 * This is the assessment's equivalent of `toStudentView` for exercises: the one
 * place that decides what a learner may see. Exported so it can be tested
 * directly -- a leak here is silent, and would let somebody reverse-engineer the
 * answer that produces the result they wanted.
 */
export function toClientItem(item: AssessmentItem) {
  if (item.kind === 'likert') {
    return {
      id: item.id,
      kind: item.kind,
      dimension: item.dimension,
      statement: item.statement,
    };
  }
  return {
    id: item.id,
    kind: item.kind,
    dimension: item.dimension,
    prompt: item.prompt,
    detail: item.detail,
    options: item.options.map((option) => ({
      id: option.id,
      label: option.label,
      detail: option.detail,
    })),
  };
}

/** The instrument itself, plus an honest statement of what it is not. */
assessmentRouter.get('/items', (_request, response) => {
  sendOk(response, {
    items: ITEMS.map(toClientItem),
    dimensions: DIMENSIONS,
    disclaimer:
      'This is a career-guidance tool, not a validated psychometric test. It has not been normed on a population, and its predictive accuracy is unmeasured. Treat the result as a structured conversation starter rather than a verdict.',
  });
});

/** Current progress, for resuming a half-finished assessment. */
assessmentRouter.get(
  '/state',
  asyncRoute(async (request, response) => {
    sendOk(response, await getState(userIdOf(request)));
  }),
);

const responsesSchema = z.object({
  responses: z
    .array(
      z.object({
        itemId: z.string().max(64),
        value: z.number().int().min(1).max(5).optional(),
        optionId: z.string().max(64).optional(),
      }),
    )
    .max(200),
});

/** Save answers as the learner goes, so an abandoned session loses nothing. */
assessmentRouter.post(
  '/responses',
  asyncRoute(async (request, response) => {
    const { responses } = responsesSchema.parse(request.body);
    sendOk(response, await saveResponses(userIdOf(request), responses));
  }),
);

/** Score and return the report. */
assessmentRouter.post(
  '/submit',
  asyncRoute(async (request, response) => {
    const report = await submit(userIdOf(request));
    sendOk(response, { report, shareable: shareableSummary(report) });
  }),
);

const retakeSchema = z.object({ dimension: z.enum(DIMENSIONS) });

/** Clear one dimension so it can be answered again. */
assessmentRouter.post(
  '/retake',
  asyncRoute(async (request, response) => {
    const { dimension } = retakeSchema.parse(request.body);
    sendOk(response, await retakeDimension(userIdOf(request), dimension));
  }),
);

assessmentRouter.post(
  '/reset',
  asyncRoute(async (request, response) => {
    sendOk(response, await resetAssessment(userIdOf(request)));
  }),
);

/**
 * Lane detail.
 *
 * Served separately from the report so somebody can browse every lane whether or
 * not they took the assessment. Nobody should have to answer seventy questions
 * to find out what a forensics job involves.
 */
assessmentRouter.get('/lanes', (_request, response) => {
  sendOk(response, {
    lanes: LANE_PROFILES,
    toolPhilosophy: TOOL_PHILOSOPHY,
  });
});

assessmentRouter.get(
  '/lanes/:laneId',
  asyncRoute(async (request, response) => {
    const lane = getLaneProfile(request.params.laneId!);
    if (!lane) throw new HttpError(404, API_ERROR_CODES.notFound, 'No such lane.');

    const track = lane.trackId ? getTrack(lane.trackId) : null;

    sendOk(response, {
      lane,
      certifications: resolveCertifications(lane.certPathway),
      certPhilosophy: CERT_PHILOSOPHY,
      // When a learning track backs this lane, show what it would require.
      ...(track
        ? {
            track,
            foundations: trackFoundations(track.id),
            readiness: trackReadiness(track.id),
          }
        : {}),
    });
  }),
);

const profileSchema = z.object({
  sector: z.enum(['private', 'government', 'either']).optional(),
  orgSize: z.enum(['small', 'large', 'either']).optional(),
  govLevel: z.enum(['federal', 'state_local', 'either', 'not_applicable']).optional(),
  clearance: z.enum(['holds', 'eligible', 'unsure', 'not_eligible']).optional(),
  background: z
    .enum([
      'it_support',
      'software',
      'military',
      'compliance_legal',
      'finance',
      'healthcare',
      'education',
      'trades_other',
      'none',
    ])
    .optional(),
  chosenTrackId: z.string().max(64).optional(),
});

assessmentRouter.get(
  '/profile',
  asyncRoute(async (request, response) => {
    sendOk(response, { profile: await getProfile(userIdOf(request)) });
  }),
);

/**
 * Update the profile, including choosing a track.
 *
 * The recommendation is explicitly overridable: a learner can pick any track,
 * including one the assessment scored poorly. Refusing that would make the tool
 * a gatekeeper, which it has no business being.
 */
assessmentRouter.patch(
  '/profile',
  asyncRoute(async (request, response) => {
    const patch = profileSchema.parse(request.body);

    if (patch.chosenTrackId && !getTrack(patch.chosenTrackId)) {
      throw new HttpError(404, API_ERROR_CODES.notFound, 'No such track.');
    }

    const profile = await updateProfile(userIdOf(request), {
      ...patch,
      ...(patch.chosenTrackId ? { assessedAt: new Date().toISOString() } : {}),
    });

    sendOk(response, {
      profile,
      ...(profile.chosenTrackId
        ? {
            foundations: trackFoundations(profile.chosenTrackId),
            readiness: trackReadiness(profile.chosenTrackId),
          }
        : {}),
    });
  }),
);
