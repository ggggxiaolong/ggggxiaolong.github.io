---
title: Okhttp HTTPS
date: 2016-06-03 12:00:00
categories:
 - Android
tags:
 - Okhttp
---

OkHttp 试图平衡两种竞争的担忧：

* **Connectivity**连接到尽可能多的主机。包括运行最新版本[boringssl](https://boringssl.googlesource.com/boringssl/) 的先进主机，和运行老版本[OpenSSL](https://www.openssl.org/)过时主机
* **Security** 连接的可靠性。包括使用证书和用强密码加密的私有数据来验证远程服务器。

当连接HTTPS服务器时，OkHttp需要知道服务器提供的 [TLS versions](http://square.github.io/okhttp/3.x/okhttp/okhttp3/TlsVersion.html)和 [cipher suites](http://square.github.io/okhttp/3.x/okhttp/okhttp3/CipherSuite.html)。客户端想要使连接最大化就需要包含完整的TLS版本和设计时就弱的密码套件（weak-by-design cipher suites）。客户端想要使安全最大化就要限制只使用最新的TLS版本和最强的密码套件（strongest cipher suites）。

针对安全和连接的设计是由 [ConnectionSpec](http://square.github.io/okhttp/3.x/okhttp/okhttp3/ConnectionSpec.html)实现的。OkHttp包含三种内建连接规格：
* <code>MODERN_TLS</code>与当今HTTPS服务器建立连接的安全配置
* <code>COMPATIBLE_TLS</code>与安全但不是如今的HTTPS服务器建立连接的安全配置
* <code>CLEARTEXT</code>用于<code>http://</code>URL的不可靠配置

默认情况下OkHttp将优先使用<code>MODERN_TLS</code>连接，如果失败则使用<code>COMPATIBLE_TLS</code>。

TLS版本和密码套件在每次发布时都会改变。例如在OkHttp 2.2时不再支持SSL3.0来阻止 [POODLE](http://googleonlinesecurity.blogspot.ca/2014/10/this-poodle-bites-exploiting-ssl-30.html) 攻击，在OkHttp 2.3时我们不再支持[RC4](http://en.wikipedia.org/wiki/RC4#Security)。作为你的桌面浏览器，保持OkHttp的更新是保证安全的最好方式。

你也可以使用定制的TLS版本和密码套件自定义连接规格，例如，这个配置限制了3个高度重视的密码套件。弊端就是最低需要安卓5.0和一个相似的流行服务器。
```java
    ConnectionSpec spec = new ConnectionSpec
        .Builder(ConnectionSpec.MODERN_TLS) .tlsVersions(TlsVersion.TLS_1_2)        
        .cipherSuites( 
            CipherSuite.TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,   
            CipherSuite.TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256, 
            CipherSuite.TLS_DHE_RSA_WITH_AES_128_GCM_SHA256)
        .build();
    
    OkHttpClient client = new OkHttpClient.Builder()
        .connectionSpecs(Collections.singletonList(spec))
        .build();
```
### [Certificate Pinning](https://github.com/square/okhttp/blob/master/samples/guide/src/main/java/okhttp3/recipes/CertificatePinning.java)
默认情况下OkHttp信任已授权的主机平台的证书。这个策略使连接最大化，但是会受证书颁发机构的攻击 例如 [2011 DigiNotar attack](http://www.computerworld.com/article/2510951/cybercrime-hacking/hackers-spied-on-300-000-iranians-using-fake-google-certificate.html)。它也假设你的HTTPS服务器的证书是证书颁发机构签署的。

用[CertificatePinner](http://square.github.io/okhttp/3.x/okhttp/okhttp3/CertificatePinner.html)限制那些证书和认证是可信的。证书定制增加了安全性，但是也限制了你的服务器团队更新TLS证书的权利。
**在没有经过服务器TLS管理员的同意下不要使用证书定制**
```java
    public CertificatePinning() {
        client = new OkHttpClient.Builder()
            .certificatePinner(new CertificatePinner.Builder()
                .add("publicobject.com", "sha256/afwiKY3RxoMmLkuRW1l7QsPZTJPwDS2pdDROQjXw8ig=")
                .build())
        .build();
    }
    
    public void run() throws Exception {
        Request request = new Request.Builder()
            .url("https://publicobject.com/robots.txt")
            .build();
    
        Response response = client.newCall(request).execute();
        if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);
    
        for (Certificate certificate : response.handshake().peerCertificates()) {
          System.out.println(CertificatePinner.pin(certificate));
        }
    }
```
### [Customizing Trusted Certificates](https://github.com/square/okhttp/blob/master/samples/guide/src/main/java/okhttp3/recipes/CustomTrust.java)
下列的代码展示了怎么使用你自己的设置替换主机平台的认证授权，就像前面所说的**在没有经过服务器TLS管理员的同意下不要使用证书定制**
```java
    private final OkHttpClient client;
    
    public CustomTrust() {
        SSLContext sslContext =
            sslContextForTrustedCertificates(trustedCertificatesInputStream());
        client = new OkHttpClient.Builder()
            .sslSocketFactory(sslContext.getSocketFactory())
            .build();
    }
    
    public void run() throws Exception {
        Request request = new Request.Builder()
            .url("https://publicobject.com/helloworld.txt")
            .build();
    
        Response response = client.newCall(request).execute();
        System.out.println(response.body().string());
    }
    
    private InputStream trustedCertificatesInputStream() {
        ... // Full source omitted. See sample.
    }
    
    public SSLContext sslContextForTrustedCertificates(InputStream in) {
        ... // Full source omitted. See sample.
    }
```