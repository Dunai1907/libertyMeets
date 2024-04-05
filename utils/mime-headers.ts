import config from "config";
import { NIL as NIL_UUID } from "uuid";

const baseDomain = config.get<string>("emails.replySetup.baseDomain");

const UUID_SIMPLE_RE = '(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|' + NIL_UUID + ')';

const EMAIL_WITH_THREAD_ID_RE = new RegExp('\\<?('+ UUID_SIMPLE_RE +')@' + baseDomain + '\\>?', 'i');

export const extractThreadIdFromHeaderStr = (headerStr: string) => {
  return headerStr.split(/\s+/)
    .filter(Boolean)
    .map(s => s.trim())
    .filter(Boolean)
    .map((ref) => {
      const t = ref.match(EMAIL_WITH_THREAD_ID_RE);
      if (!t) {
        return false;
      }
      return t[1];
    })
    .filter(Boolean)
    .shift();
};
