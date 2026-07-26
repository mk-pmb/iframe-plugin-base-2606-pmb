import arrayOfTruths from 'array-of-truths';
import getOwn from 'getown';
import jq from 'jquery';
import jq80 from 'jq80-pmb';
import lodash from 'lodash';
import mustBe from 'typechecks-pmb/must-be.js';
import objDive from 'objdive';
import objPop from 'objpop';
import pDefer from 'p-defer';
import pDelay from 'delay';
import pEachSeries from 'p-each-series';
import pMapSeries from 'p-map-series';
import pProps from 'p-props';
import qrystr from 'qrystr';
import subjclog from 'subjclog2607-pmb';
import uniEmoji from 'unicode-emoji-pmb';

import rpcAdapter from '../rpc/adapter.mjs';
import rpcKitchenSink from '../rpc/rpcKitchenSink.mjs';

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
  arrayOfTruths,
  emoji,
  getOwn,
  jq,
  jq80,
  lodash,
  mustBe,
  objDive,
  objPop,
  pDefer,
  pDelay,
  pEachSeries,
  pMapSeries,
  pProps,
  qrystr,
  rpcAdapter,
  rpcKitchenSink,
  subDict,
  subjclog,
  unicode,
};

const app = subDict(globalThis, 'app');
subDict(app, 'cfg');
subDict(globalThis, 'lib', deps);

export default deps;
