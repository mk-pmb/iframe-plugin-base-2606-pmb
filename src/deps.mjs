import getOwn from 'getown';
import jq from 'jquery';
import jq80 from 'jq80-pmb';
import mustBe from 'typechecks-pmb/must-be.js';
import objDive from 'objdive';
import objPop from 'objpop';
import qrystr from 'qrystr';
import subjclog from 'subjclog2607-pmb';
import uniEmoji from 'unicode-emoji-pmb';

const { unicode, emoji } = uniEmoji;

jq80.jq = jq;

function subDict(o, k, a) {
  let d = o[k];
  if (d) {
    if (a) { Object.assign(d, a); }
  } else {
    d = (a || {});
    o[k] = d; // eslint-disable-line no-param-reassign
  }
  return d;
}

const deps = {
  emoji,
  getOwn,
  jq,
  jq80,
  mustBe,
  objDive,
  objPop,
  qrystr,
  subDict,
  subjclog,
  unicode,
};

const app = subDict(globalThis, 'app');
subDict(app, 'cfg');
subDict(globalThis, 'lib', deps);

export default deps;
