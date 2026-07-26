// -*- coding: utf-8, tab-width: 2 -*-

import kisi from './rpcKitchenSink.mjs';
import makeDeferred from './deferredDeluxe.mjs';

const soon = kisi.mthdSoon;

const Ctor = function RpcAdapter() {};
const PT = Ctor.prototype;
Object.assign(PT, {
  toString() { return '[RpcAdapter ' + this.config.name + ']'; },
});


const EX = function makeRpcAdapter(customConfig) {
  const ra = new Ctor();
  Object.entries(EX.adapterApi).forEach(
    function bindMethod([k, v]) { ra[k] = v.bind(null, ra); });
  ra.getSelf = () => ra; /* getSelf is meant as a convenient pre-made
    context-independent getter so your app doesn't have to create its own
    (redundant) getters. Do NOT refactor it to a `this`-dependent method! */

  ra.config = {
    ...EX.defaultConfig,
    name: 'unnamed.' + (Date.now() + Math.random()),
    getNextMsgId: EX.getNextGlobalMsgId,
    requestHandlers: {},
    fallbackRequestHandler: false,
    ...customConfig,
  };
  ra.msgPort = false;
  ra.pendingRequest = false;
  ra.initReply = false; /*
    We remember the initReply because it usually gives details about the
    the plugin's interface expectations.
    */

  return ra;
};


Object.assign(EX, {

  getNextGlobalMsgId: kisi.makeCounter(1), // global counter = easier debugging
  getPrototype: kisi.makeGetter(PT),


  defaultConfig: {
    acceptablePeerOrigin: '*',
    iframeConnectTimeoutSec: 10,
    requestTimeoutSec: 2,
  },


  receiveRpcEvent(ra, evt) {
    const { method, params } = evt.data;
    console.debug(String(ra), method, params, evt.ports);
    // eslint-disable-next-line no-param-reassign
    ra.latestReceivedEvent = evt;
  },


});


EX.adapterApi = {

  getPosCfgNum(ra, k) { return (+ra.config[k] || +EX.defaultConfig[k] || 0); },


  onError: function logAndComplainToUser(ra, err) {
    // Apps are meant to override this with their own handler.
    const trace = String(ra);
    console.error(trace, err);
    const msg = 'Unhandled error in ' + trace + ':\n' + err;
    soon(window, 'alert', msg);
  },


  panic(ra, why, details) {
    const err = new Error(why);
    Object.assign(err, details);
    err.rpcAdapter = ra;
    soon(ra, 'onError', err);
    throw err;
  },


  sendRequest(ra, method, params) {
    if (ra.pendingRequest) {
      ra.panic('Cannot request ' + method + ': Operating in serial mode '
        + 'and previous operation is still in progress.');
    }
    const cfg = ra.config;
    const msg = { id: cfg.getNextMsgId(), method, params };
    if (msg.params === undefined) { msg.params = null; }
    const pend = { ...msg };
    pend.descr = cfg.name + ' RPC request #' + msg.id + '=' + msg.method;
    // eslint-disable-next-line no-param-reassign
    ra.pendingRequest = pend;

    const timeoutErrorName = 'RpcRequestTimeout';
    Object.assign(pend, makeDeferred({
      descr: pend.descr,
      timeoutErrorName,
      timeoutSec: ra.getPosCfgNum('requestTimeoutSec'),
    }).plain);
    pend.promise.then(null,
      err => ra.unregisterFailedPendingRequest(pend, err));

    ra.msgPort.postMessage(msg);
    return pend.promise;
  },


  unregisterFailedPendingRequest(ra, affectedRequest, error) {
    if (ra.pendingRequest !== affectedRequest) {
      const msg = ('Unexpected parallel request failure'
        + ' while operating in serial mode: ' + error);
      ra.panic(msg, { error, affectedRequest });
      return; // Do not interfere with the new (current) pending request.
    }
    // eslint-disable-next-line no-param-reassign
    ra.pendingRequest = false;
  },


};



export default EX;
