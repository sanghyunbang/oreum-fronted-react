const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/vworld',
    createProxyMiddleware({
      target: 'https://api.vworld.kr',
      changeOrigin: true,
      pathRewrite: { '^/vworld': '' }, //vword제거
    })
  );

  // 기상청 프록시 추가
  app.use(
    '/weatherapi',
    createProxyMiddleware({
      target: 'https://apis.data.go.kr',
      changeOrigin: true,
      pathRewrite: { '^/weatherapi': '' },
    })
  );

  app.use(
    '/kakaoapi',
    createProxyMiddleware({
      target: 'https://dapi.kakao.com',
      changeOrigin: true,
      pathRewrite: { '^/kakaoapi': '' },
    })
  );
};


