# AIWebRPG
基于AI的网页文字RPG

部署：

1.（必须）在服务器上安装nodejs，并启动router.js（参见startup.bat）

	1.1 如果网页和代理使用不同的地址，则需要修改main.js开头的_proxy_指向
 
2.（可选）在公开部署中保护私有api key

	2.1 修改main.js，在开头的API_PRESETS里填入对应的api接口信息，以及一个映射用的key
  
	2.2 修改router.js，在开头的_default_keys里填入对应的key映射
  
3.访问index.html即可开始使用

