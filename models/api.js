const MODE = 'devlopment';
const VERSION =  'V0.0.1';
const DEVELOPMENT_PREFIX = 'http://localhost:3000/api'
const PREFIX =  ( MODE === 'production' ) ? PRODUCTION_PREFIX : DEVELOPMENT_PREFIX;
export default {
  MODE: MODE,
  okr: `${PREFIX}/okr`,
  todo: `${PREFIX}/todo`,
  login: `${PREFIX}/login`,
  todo_keyesult: `${PREFIX}/todo_keyesult`,
  keyesult: `${PREFIX}/keyesult`,
}