const EX = async function connectToIframe(how) {
  const { iframe, method, params, ...adaperConfig } = how;
  const sham = {
    name: 'domRpcSham',
    requestHandlers: {},
    fallbackRequestHandler: false,
    sendRequest(m, p) { return iframe.contentWindow.domRpcRequest(m, p); },
    ...adaperConfig,
  };
  iframe.domRpcInit = { method, params, hostSham: sham };
  return sham;
};


export default EX;
