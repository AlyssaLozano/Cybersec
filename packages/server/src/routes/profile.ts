/**
 * Profile routes.
 *
 * WHY THE PUBLIC READ IS NOT BEHIND requireAuth
 *
 * A profile set to "anybody with the link" has to be readable by somebody with
 * the link, and that includes a hiring manager who has no account here. That
 * is the entire point of the setting, and putting the whole router behind a
 * sign-in wall would leave it looking like it worked while nobody outside
 * could ever see it.
 *
 * The service decides. This router passes a viewer id when there is one and
 * null when there is not, and `profileFor` returns null for anything that
 * viewer may not see.
 */

import { Router } from 'express';
import { z } from 'zod';

import {
  ABOUT_MAX,
  API_ERROR_CODES,
  DISPLAY_NAME_MAX,
  HEADLINE_MAX,
  LOCATION_MAX,
  PROFILE_VISIBILITIES,
} from '@soc/shared';

import { asyncRoute, HttpError, requireActiveAccount, requireAuth, sendOk } from '../http.js';
import {
  ProfileError,
  myProfile,
  profileByCallSign,
  profileFor,
  saveProfile,
} from '../services/profile.js';

export const profileRouter = Router();

function viewerOf(request: { session?: { sub: string } }): string | null {
  return request.session?.sub ?? null;
}

function asHttp(error: unknown): never {
  if (error instanceof ProfileError) {
    throw new HttpError(error.status, API_ERROR_CODES.validationFailed, error.message, error.problems);
  }
  throw error;
}

/**
 * Somebody else's profile, by call sign.
 *
 * By call sign rather than by user id, because the call sign is the only name
 * anybody in a room ever hears, and a link somebody pastes into an application
 * should read as a name rather than as a uuid.
 */
profileRouter.get(
  '/by-call-sign/:callSign',
  asyncRoute(async (request, response) => {
    const profile = await profileByCallSign(request.params.callSign!, viewerOf(request));
    if (!profile) {
      // The same answer for a profile that is private and one that does not
      // exist. See the service for why.
      throw new HttpError(404, API_ERROR_CODES.notFound, 'No profile there.');
    }
    sendOk(response, { profile });
  }),
);

profileRouter.get(
  '/user/:userId',
  asyncRoute(async (request, response) => {
    const profile = await profileFor(request.params.userId!, viewerOf(request));
    if (!profile) throw new HttpError(404, API_ERROR_CODES.notFound, 'No profile there.');
    sendOk(response, { profile });
  }),
);

/* -- the person's own, which needs a session ---------------------------- */

const mine = Router();
mine.use(requireAuth, requireActiveAccount);

function userIdOf(request: { session?: { sub: string } }): string {
  const id = request.session?.sub;
  if (!id) throw new HttpError(401, API_ERROR_CODES.unauthenticated, 'Not signed in.');
  return id;
}

mine.get(
  '/',
  asyncRoute(async (request, response) => {
    try {
      sendOk(response, { profile: await myProfile(userIdOf(request)) });
    } catch (error) {
      asHttp(error);
    }
  }),
);

const saveBody = z.object({
  displayName: z.string().max(DISPLAY_NAME_MAX).default(''),
  headline: z.string().max(HEADLINE_MAX).default(''),
  about: z.string().max(ABOUT_MAX).default(''),
  location: z.string().max(LOCATION_MAX).default(''),
  /*
   * Generous length caps on the raw values, because these hold whatever
   * somebody pasted. The parser is what decides whether it is a handle, and a
   * length refusal here would reject a perfectly good URL with tracking
   * parameters on the end.
   */
  github: z.string().max(300).default(''),
  linkedin: z.string().max(300).default(''),
  openToWork: z.boolean().default(false),
  visibility: z.enum(PROFILE_VISIBILITIES).default('private'),
});

mine.put(
  '/',
  asyncRoute(async (request, response) => {
    const body = saveBody.parse(request.body ?? {});
    try {
      sendOk(response, { profile: await saveProfile(userIdOf(request), body) });
    } catch (error) {
      asHttp(error);
    }
  }),
);

profileRouter.use('/me', mine);
