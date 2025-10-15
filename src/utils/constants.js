/**
 * Application Constants
 */

export const USER_ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  COORDINATOR: 'coordinator',
  USER: 'user'
};

export const USER_STATUS = {
  VERIFIED: 'verified',
  PENDING: 'pending',
  DELETED: 'deleted'
};

export const PARTICIPANT_STATUS = {
  VERIFIED: 'verified',
  PENDING: 'pending',
  DELETED: 'deleted'
};

export const PARTICIPANT_TYPES = {
  INDIVIDUAL: 'individual',
  SCHOOL: 'school'
};

export const QUIZ_ROUNDS = {
  SCREENING_TEST: 'screeningTest',
  PRELIMINARY: 'preliminary',
  SEMI_FINALS: 'semiFinals',
  FINALS: 'finals'
};

export const RESULT_POSITIONS = {
  FIRST: '1st',
  SECOND: '2nd',
  THIRD: '3rd',
  QUALIFIED: 'qualified',
  DISQUALIFIED: 'disqualified'
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};