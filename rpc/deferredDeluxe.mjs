// -*- coding: utf-8, tab-width: 2 -*-

import loMapValues from 'lodash.mapvalues';
import mustBe from 'typechecks-pmb/must-be.js';
import objPop from 'objpop';
import pDefer from 'p-defer';


const EX = function makeDeferredDeluxe(how) {
  const popHow = objPop(how, { mustBe }).mustBe;
  const plain = pDefer();
  const dfr = {
    ...plain,
    plain,
    ...loMapValues({
      descr: 'nonEmpty str',
      onTimeout: 'undef | eeq:false | fun',
      timeoutErrorName: 'undef | nonEmpty str',
    }, (rule, key) => popHow(rule, key)),
  };
  EX.installTimeoutWatchdogOnDeferred(dfr,
    popHow('pos fin num', 'timeoutSec'));
  popHow.expectEmpty('Unsupported config option(s)');
  return dfr;
};



Object.assign(EX, {

  defaultTimeoutErrorName: 'PromiseWatchdogTimeout',


  installTimeoutWatchdogOnDeferred(dfr, timeoutSeconds, onTimeout) {
    const origPr = dfr.promise;
    let tmo = setTimeout(function tooLate() {
      const errName = (dfr.timeoutErrorName || EX.defaultTimeoutErrorName);
      const errMsg = (dfr.descr + ': ' + errName
        + ' after ' + timeoutSeconds + ' sec');
      const errBase = new Error(errMsg);
      errBase.name = errName;
      const ctx = { dfr, err: errBase };
      try { // opportunity to customize or even replace the error:
        if (onTimeout?.call) { onTimeout(ctx); }
      } catch (hndErr) {
        (ctx.err || errBase).timeoutHandlerError = hndErr;
      }
      if (!ctx.err) { ctx.err = errBase; }
      ctx.err.getPromise = () => origPr;
      dfr.reject(ctx.err);
    }, timeoutSeconds * 1e3);
    origPr.then(null, Boolean).then(function cancel() {
      if (!tmo) { return; }
      clearTimeout(tmo);
      tmo = false;
    });
  },


});


export default EX;
