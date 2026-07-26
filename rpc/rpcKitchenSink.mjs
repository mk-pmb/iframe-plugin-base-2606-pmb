// -*- coding: utf-8, tab-width: 2 -*-

const EX = {

  VERSION: {
    name: 'rpcKitchenSink',
    uuid: 'e992f87d-62ea-413d-8fec-0de029756b46',
    apiVer: 260716_1400,
  },


  makeGetter(x) { return function getter() { return x; }; },


  makeCounter(start) {
    // No BigInt: At our click rates, Earth's sun will burn Earth first.
    let cur = (+start || 0) - 1;
    return function count() {
      if (cur >= Number.MAX_SAFE_INTEGER) {
        // Incrementing further would be unsafe
        throw new RangeError('Counter ran out of safe numbers.');
      }
      cur += 1;
      return cur;
    };
  },


  expectKeyless(x, descr) {
    if (!x) { return; } // false-y values never have keys
    const keys = Object.keys(x).sort().join(', ');
    if (!keys) { return; }
    throw new Error('Unexpected keys in ' + descr + ': ' + keys);
  },


  mthdSoon(obj, mtd, ...args) {
    const ctx = (obj || null); // normalize any false-y obj to null
    const impl = (obj ? obj[mtd] : mtd);
    if (!impl.call) {
      throw new TypeError('Implementation not call-able, double-check object!');
    }
    const cb = impl.bind(ctx, ...args);
    setTimeout(cb, 1); // run asap but allow browser UI updates
  },



};


export default EX;
