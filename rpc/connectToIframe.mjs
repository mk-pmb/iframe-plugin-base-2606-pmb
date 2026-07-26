// -*- coding: utf-8, tab-width: 2 -*-

import makeDeferred from './deferredDeluxe.mjs';
import makeRpcAdapter from './adapter.mjs';


const EX = async function connectToIframe(how) {
  const { iframe, method, params, ...adapterConfig } = how;
  const ra = makeRpcAdapter(adapterConfig);
  const cfg = ra.config;
  // eslint-disable-next-line no-param-reassign
  iframe.getRpcAdapter = ra.getSelf;
  const chan = new MessageChannel();
  const port = chan.port1;
  port.onmessage = EX.receiveRpcEvent.bind(null, ra);
  const connectDfr = makeDeferred({
    descr: 'connectToIframe',
    timeoutErrorName: 'RpcIframeConnectTimeout',
    timeoutSec: ra.getPosCfgNum('iframeConnectTimeoutSec'),
  });
  iframe.addEventListener('load', async function iframeLoaded() {
    iframe.removeEventListener('load', iframeLoaded);
    let replyPr;
    try {
      // eslint-disable-next-line no-param-reassign
      ra.msgPort = {
        postMessage: function messagePortShimForFirstMessage(msg) {
          iframe.contentWindow.postMessage(msg,
            cfg.acceptablePeerOrigin, [chan.port2]);
        },
      };
      replyPr = ra.sendRequest(method, params);
    } finally {
      // eslint-disable-next-line no-param-reassign
      ra.msgPort = false; // unregister the shim
    }
    // eslint-disable-next-line no-param-reassign
    ra.initReply = await replyPr;
    // eslint-disable-next-line no-param-reassign
    ra.msgPort = port;
    connectDfr.resolve(ra);
  });
  return ra;
};


export default EX;
