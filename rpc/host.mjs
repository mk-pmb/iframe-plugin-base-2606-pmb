// -*- coding: utf-8, tab-width: 2 -*-

import makeRpcAdapter from './adapter.mjs';
import connectToIframe from './connectToIframe.dom-sham.mjs';


const EX = {
  connectToIframe,
  makeRpcAdapter, // in case the host also wants to act as a client
};


export default EX;
