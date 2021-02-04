---
title: Okhttp Connections
date: 2016-06-01 12:00:00
categories:
 - Android
tags:
 - Okhttp
---

## Connections

尽管你只提供了 URL，OkHttp 还是会使用 3 种方式连接到你的服务器：URL，Adress，和 Route。 ###[URLs](http://square.github.io/okhttp/3.x/okhttp/okhttp3/HttpUrl.html)
URL（比如 https://github.com/square/okhttp ）是 HTTP 和网络的基础。另外它也是普遍的互联网分散式命名方案，它也规定了如何访问一个互联网资源。

URL 是抽象的：

- 它规定了访问是明文（http）还是密文（https），但是却没有规定使用哪种加密算法，怎么验证其他网站的可靠性（ [主机名验证](http://developer.android.com/reference/javax/net/ssl/HostnameVerifier.html)）和那些证书是可信的（[SSLSocketFactory](http://developer.android.com/reference/org/apache/http/conn/ssl/SSLSocketFactory.html)）

- 它没有规定是否使用特别的代理服务器和怎么通过代理服务器的用户验证。

每个 URL 都指定了具体的访问路径（例如：/square/okhttp）和查询请求（例如：？q=sharks\$lang=en）。每个服务器都包含了大量的 URL。 ###[Addresses](http://square.github.io/okhttp/3.x/okhttp/okhttp3/Address.html)
地址指定了一个服务器（例如:github.com）和访问服务器所必须的静态配置：端口，和网络协议（HTTP/2 或者 SPDY）。

使用相同地址的 URL 很可能使用相同的底层 TCP 套接字连接。共享连接有如下好处：更低的网络延时，更高的吞吐量（源于[TCP 的慢启动](http://www.igvita.com/2011/10/20/faster-web-vs-tcp-slow-start/)），更省电。OkHttp 使用[连接池](http://square.github.io/okhttp/3.x/okhttp/okhttp3/ConnectionPool.html)自动重用 HTTP/1.X 连接和复用 HTTP/2 与 SPDY 连接。

OkHttp 中地址的字段一部分来自于 URL（scheme，主机名，端口）其他的来自于  [OkHttpClient](http://square.github.io/okhttp/3.x/okhttp/okhttp3/OkHttpClient.html)。

### [Routes](http://square.github.io/okhttp/3.x/okhttp/okhttp3/Route.html)

Routes 提供了连接到具体服务器所必须的动态的信息。IP 地址（通过 DNS 查询获取），代理服务（通过使用的[ProxySelector](http://developer.android.com/reference/java/net/ProxySelector.html)获取）和所使用的 TLS 版本（用于 HTTPS 连接）。

对于一个地址可能有很多 Routes。例如一个服务器托管在多个数据中心在它的 DNS 响应中可能包含多个 IP 地址。

### [Connections](http://square.github.io/okhttp/3.x/okhttp/okhttp3/Connection.html)

当你使用 OkHttp 访问一个 URL 时，OkHttp 将做如下的事情：

1. 使用 URL，配置 OkHttpClient 来创建一个**address**，这个 address 规定了如何连接到服务器。
2. 试图从连接池获取这个 address 的连接
3. 如果在连接池中没有找到连接，选择一个 route 连接，这通常意味着通过 DNS 请求服务器的 IP 地址，在必要的情况下选择 TLS 版本和代理服务器。
4. 如果这是一个新 route，它既可以通过一个套接字直连，一个 TLS 通道（用于 HTTP 上的 HTTPS 代理）也可以通过 TLS 直连必要时进行 TLS 握手。
5. 发送 HTTP 请求，获取响应。

如果在建立连接时遇到问题，OkHttp 尝试选择另外一个 route 连接。OkHttp 将释放服务器地址无法访问的连接。这对那些已经缓存的过时连接或者不支持的 TLS 版本同样起作用（将无效的连接释放）。

一旦接收 response，连接就会被连接池收集用于接下来的连接（复用），连接池会释放闲置的连接。
