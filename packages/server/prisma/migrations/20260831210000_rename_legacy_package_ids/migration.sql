-- Rename the four legacy numeric package ids to names.
--
-- Packages 1-4 were written before the naming convention existed and used bare
-- numeric ids ('1', exercises '1.1.1'). Two sessions writing content at the same
-- time both reached for "the next number" and collided, which is what the
-- convention in content/index.ts now prevents. This migration brings the four
-- legacy packages onto it so nothing in the catalogue is numbered any more.
--
-- Exercise ids are permanent BECAUSE progress rows reference them, so this
-- migration exists to move those rows with the content rather than orphan them.
-- It is a one-time correction taken while the only rows in existence belong to a
-- local demo seed; see CLAUDE.md, which records the date after which the rule is
-- absolute.
--
-- Note practice_progress carries the parent id in exerciseId and the drill id
-- (same prefix, -pN suffix) in practiceId. Both need rewriting.
--
-- Written to run on SQLite today and Postgres later: substr, || and LIKE all
-- behave the same on both.

UPDATE "exercise_progress" SET "exerciseId" = 'linux.'  || substr("exerciseId", 3) WHERE "exerciseId" LIKE '1.%';
UPDATE "exercise_progress" SET "exerciseId" = 'logs.'   || substr("exerciseId", 3) WHERE "exerciseId" LIKE '2.%';
UPDATE "exercise_progress" SET "exerciseId" = 'triage.' || substr("exerciseId", 3) WHERE "exerciseId" LIKE '3.%';
UPDATE "exercise_progress" SET "exerciseId" = 'net.'    || substr("exerciseId", 3) WHERE "exerciseId" LIKE '4.%';

UPDATE "exercise_progress" SET "packageId" = 'linux-fundamentals' WHERE "packageId" = '1';
UPDATE "exercise_progress" SET "packageId" = 'log-analysis'       WHERE "packageId" = '2';
UPDATE "exercise_progress" SET "packageId" = 'incident-triage'    WHERE "packageId" = '3';
UPDATE "exercise_progress" SET "packageId" = 'networking'         WHERE "packageId" = '4';

UPDATE "practice_progress" SET "exerciseId" = 'linux.'  || substr("exerciseId", 3) WHERE "exerciseId" LIKE '1.%';
UPDATE "practice_progress" SET "exerciseId" = 'logs.'   || substr("exerciseId", 3) WHERE "exerciseId" LIKE '2.%';
UPDATE "practice_progress" SET "exerciseId" = 'triage.' || substr("exerciseId", 3) WHERE "exerciseId" LIKE '3.%';
UPDATE "practice_progress" SET "exerciseId" = 'net.'    || substr("exerciseId", 3) WHERE "exerciseId" LIKE '4.%';

UPDATE "practice_progress" SET "practiceId" = 'linux.'  || substr("practiceId", 3) WHERE "practiceId" LIKE '1.%';
UPDATE "practice_progress" SET "practiceId" = 'logs.'   || substr("practiceId", 3) WHERE "practiceId" LIKE '2.%';
UPDATE "practice_progress" SET "practiceId" = 'triage.' || substr("practiceId", 3) WHERE "practiceId" LIKE '3.%';
UPDATE "practice_progress" SET "practiceId" = 'net.'    || substr("practiceId", 3) WHERE "practiceId" LIKE '4.%';

UPDATE "terminal_sessions" SET "exerciseId" = 'linux.'  || substr("exerciseId", 3) WHERE "exerciseId" LIKE '1.%';
UPDATE "terminal_sessions" SET "exerciseId" = 'logs.'   || substr("exerciseId", 3) WHERE "exerciseId" LIKE '2.%';
UPDATE "terminal_sessions" SET "exerciseId" = 'triage.' || substr("exerciseId", 3) WHERE "exerciseId" LIKE '3.%';
UPDATE "terminal_sessions" SET "exerciseId" = 'net.'    || substr("exerciseId", 3) WHERE "exerciseId" LIKE '4.%';

UPDATE "attempt_logs" SET "exerciseId" = 'linux.'  || substr("exerciseId", 3) WHERE "exerciseId" LIKE '1.%';
UPDATE "attempt_logs" SET "exerciseId" = 'logs.'   || substr("exerciseId", 3) WHERE "exerciseId" LIKE '2.%';
UPDATE "attempt_logs" SET "exerciseId" = 'triage.' || substr("exerciseId", 3) WHERE "exerciseId" LIKE '3.%';
UPDATE "attempt_logs" SET "exerciseId" = 'net.'    || substr("exerciseId", 3) WHERE "exerciseId" LIKE '4.%';

UPDATE "copilot_consults" SET "exerciseId" = 'linux.'  || substr("exerciseId", 3) WHERE "exerciseId" LIKE '1.%';
UPDATE "copilot_consults" SET "exerciseId" = 'logs.'   || substr("exerciseId", 3) WHERE "exerciseId" LIKE '2.%';
UPDATE "copilot_consults" SET "exerciseId" = 'triage.' || substr("exerciseId", 3) WHERE "exerciseId" LIKE '3.%';
UPDATE "copilot_consults" SET "exerciseId" = 'net.'    || substr("exerciseId", 3) WHERE "exerciseId" LIKE '4.%';
