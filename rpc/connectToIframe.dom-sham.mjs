const EX = async function connectToIframe(how) {
  const { iframe, method, params, ...adaperConfig } = how;
  iframe.domRpcInitMethod = method;
  iframe.domRpcInitParams = params;
  const sham = {
    name: 'domRpcSham',
    requestHandlers: {},
    fallbackRequestHandler: false,
    sendRequest(m, p) { return iframe.contentWindow.domRpcRequest(m, p); },
    ...adaperConfig,
  };
  return sham;
};


export default EX;
