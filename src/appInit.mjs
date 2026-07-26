// -*- coding: utf-8, tab-width: 2 -*-

const win = globalThis;
const { app, lib } = win;

const EX = async function appInit(how) {
  if (!how) { return appInit(true); }
  if (!app.name) { app.name = EX.guessAppName(); }
  if (!app.logger) { app.logger = lib.subjclog(app.name); }
};


Object.assign(EX, {

  guessAppName() {
    if (app.name) { return app.name; }

    const fromDom = win.document.head.getAttribute('app-name');
    if (fromDom) { return fromDom; }

    let url = win.location.pathname;
    url = url.split(/\/+$|\.html$/)[0];
    url = url.split('/').slice(-1)[0];
    if (url) { return url; }

    return 'unnamed-iframe-plugin-base-app';
  },




});



export default EX;
