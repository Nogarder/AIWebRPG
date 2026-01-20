const http = require('http');
const https = require('https');
const { URL } = require('url');

//启动端口配置
const PORT = 3000;
//转发规则
const _url_prefix = 'https:/';
//自动附加后缀
const _url_surfix = "/chat/completions"
//替换key请求,注意前缀必须是Bearer空格，key前面要含有bearer前缀
//列表没有匹配的话则使用请求头中的key
const _default_keys =
{
  "Bearer defaultkey":"Bearer sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
};

http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  if (req.method !== 'POST') {
    res.writeHead(405);
    return res.end('Only POST allowed');
  }

  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {

      url = _url_prefix + req.url.replace(/\_/g, ".") + _url_surfix;

      const targetUrl = new URL(url);

      authorization = _default_keys[req.headers['authorization']] || req.headers['authorization'];

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authorization,
          'Content-Length': Buffer.byteLength(body)
        }
      };

      const proxyReq = https.request(targetUrl, options, proxyRes => {
        let responseData = '';
        proxyRes.on('data', chunk => responseData += chunk);
        proxyRes.on('end', () => {
          res.writeHead(proxyRes.statusCode, {
            'Content-Type': 'application/json'
          });
          res.end(responseData);
        });
      });

      proxyReq.on('error', err => {
        res.writeHead(500);
        res.end(JSON.stringify({ error: err.message }));
      });

      proxyReq.write(body);
      proxyReq.end();
    } catch (err) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: err.message }));
    }
  });
}).listen(PORT, () => {
  console.log(`AI Proxy running at http://0.0.0.0:${PORT}`);
});