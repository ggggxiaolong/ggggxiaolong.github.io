---
title: Okhttp Recipes
date: 2016-06-02 12:00:00
categories:
 - Android
tags:
 - Okhttp
---

我们写了一些例子来演示怎么使用 OkHttp 解决通用的问题，通过阅读这些例子来学习怎么组织所有的事情。自由复制粘贴这些例子。

### [Synchronous Get](https://github.com/square/okhttp/blob/master/samples/guide/src/main/java/okhttp3/recipes/SynchronousGet.java)

下载一个文件，打印响应头和响应体转化后的字符串。
对于小的文档 response body 的`String()`方法是方便且高效的。但是如果 response body 比较到大（>1M）应避免使用`String()`方法，因为这将把整个文档导入内存。这种情况下，优先吧 response body 作为流使用。
```java
    private final OkHttpClient client = new OkHttpClient();

    public void run() throws Exception {
          Request request = new Request.Builder()
              .url("http://publicobject.com/helloworld.txt")
              .build();

         Response response = client.newCall(request).execute();
         if(!response.isSuccessful())
              throw new IOException("Unexpected code " + response);

        Headers responseHeaders = response.headers();
        for(int i = 0; i < responseHeaders.size(); i++){
              System.out.println(
                  responseHeaders.name(i) + ":" + responseHeaders.value(i));
        }
        System.out.println(response.body().string());
    }
```
### [Asynchronous Get](https://github.com/square/okhttp/blob/master/samples/guide/src/main/java/okhttp3/recipes/AsynchronousGet.java)

在工作线程下载文件，在 response 响应时回调。当响应头准备好时调用回调函数。读取 response body 可能阻塞线程。OkHttp 目前没有提供获取 response body 部分内容的 API。
```java
    private final OkHttpClient client = new OkHttpClient();

    public void run() throws Exception {
        Request request = new Request.Builder()
            .url("http://publicobject.com/hellowworld.txt")
            .build();

        client.newCall(request).enqueue(new Callback(){
            @Override public void onFailure(Call call, IOException e) {
                e.printStackTrace();
            }

            @Override public void onResponse(Call call, Response response) throws IOException {
                if (!response.isSuccessful())
                    throw new IOException("UnExpected code " + response);

                Headers responseHeaders = response.headers();
                for (int i = 0, size = resonseHeaders.size();  i < size;i++) {
                    System.out.println(responseHeaders.name(i) + ":" + responseHeaders.value(i));
                }
                System.out.println(response.body().string());
            }
        });
    }
```
### [Accessing Headers](https://github.com/square/okhttp/blob/master/samples/guide/src/main/java/okhttp3/recipes/AccessHeaders.java)

一般 HTTP 头的就像一个`Map<String, String>`：每个字段对应一个值或空值。但是一些头允许多个值就像 Guava 的[Multimap](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/collect/Multimap.html)。比如一个 HTTP 的 response 支持多个`Vary`头。OkHttp 的 API 试图使这些情况的使用更舒服。

当写请求头时使用`header(name, value)`设置唯一的 name 对应的 value。当一个 name 对应多个 value 时，新的设置的 value 会替换原来的 value。使用`addHeader(name, value)`添加的头不会覆盖原有的头。

当读取 response 中的一个头时，使用`header(name)`将返回最后一个 name 的值。一般情况也只有一个。如果没有 value 对应`header(name)`将返回 null，`headers(name)`将返回一个当前 name 对应 value 的 list。

要访问所有的头，使用`Headers`类，这个类支持索引访问。
```java
    private final OkHttpClient client = new OkHttpClient();

    public void run() throws Exception {
        Request request = new Request.Builder()
            .url("http://api.github.com.repos/square/okhttp/issues")
            .header("User-Agent", "OkHttp Headers,java")
            .addHeader("Accept", "application/json; q=0.5")
            .addHeader("Accept", "application/vnd.github.v3+json")
            .build();

        Response response = client.newCall(request).execute();
        if (!response.isSuccessful())
            throw new IOException("Unexcepted code " + response);

      System.out.prinln("Server: " + response.header("Server"));
      System.out.prinln("Date: " + response.header("Date"));
      System.out.prinln("Vary: " + response.headers("Vary"));
    }
```
### [Posting a String](https://github.com/square/okhttp/blob/master/samples/guide/src/main/java/okhttp3/recipes/PostString.java)

用 HTTP POST 发送请求体到服务器。 这个例子发送了一个 markdown 文件到 web 服务器把 markdown 作为 HTML 展示。当请求体大于 1M 时应该避免使用这个 API 因为它会把请求体全部保存到内存中。
```java
    public static final MediaType MEDIA_TYPE_MARKDOWN = MediaType.parse("text/x-markdown; charset=utf-8");

    private final OkHttoClient client = new OkHttpClient();

    public void run() throws IOException {
        String postBody = ""
            + "Release\n"
            + "--------\n"
            + "\n"
            + " * _1.0_ May 6, 2013\n"
            + " * _1.1_ June 15, 2013\n"
            + " * _1.2_ August 11, 2013\n";
         Request request =  new Request.Builder()
            .url("http://api.github.com/markdown/raw")
            .post(RequestBody.create(MEDIA_TYPE_MARKDOWN, postBody))
            .build();

         Response response = client.newCall(request).execute();
         if (!response.isSuccessful())
             throw new IOException("Unexpected code " + response);

        System.out.println(response.body().string());
    }
```
### [Post Streaming](https://github.com/square/okhttp/blob/master/samples/guide/src/main/java/okhttp3/recipes/PostStreaming.java)

这里我们将请求体作为流提交（POST 方式）。请求体的内容在它开始写的时候生成。这个例子流将直接写入  [Okio](https://github.com/square/okio)  的缓冲槽。你编程时可能更倾向于`OutputStream`, 你可以通过`BufferedSink.outputStream()`获取。
```java
    public static final MediaType MEDIA_TYPE_MARKDOWN =
        MediaType.parse("text/x-markdown; cjarset=utf-8");

    private final OkHttpClient client = new OkHttpClient();

    public void run() throws Exception {
        RequestBody requestBody = new RequestBody() {
            @Override public MediaType contentType() {
                return MEDIA_TYPE_MARKDOWN;
            }

            @Override public void writeTo(BufferedSink sink) throws IOException {
                sink.writeUtf8("Numbers\n");
                sink.writeUtf8("-------\n");
                for (int i =2; i <= 997; i++) {
                    sink.writeUtf8(String.format(" * %s=%s\n", i, factor(i)));
                }

                private String factor(int n) {
                    for (int i = 2; i < n; i++) {
                        int x = n / i;
                        if (x * i == n) return factor(x) + x +" x " +i;
                    }
                    return Integer,toString(n);
                }
            }
        };

        Response response = client.newCall(request).execute();
        if (!response.isSuccessful())
            throw new IOException("Unexcepted code " + response);

        System.out.println(response.body().string());
    }
```
### [Posting a File](https://github.com/square/okhttp/blob/master/samples/guide/src/main/java/okhttp3/recipes/PostFile.java)

使用文件作为请求体是非常方便的。
```java
    public static final MediaType MEDIA_TYPE_MARKDOWN = MediaType.parse("text/x-markdown; charset=utf-8");

    private final OkHttoClient client = new OkHttpClient();

    public void run() throws IOException {
         File file = new File("README.md");
         Request request =  new Request.Builder()
            .url("http://api.github.com/markdown/raw")
            .post(RequestBody.create(MEDIA_TYPE_MARKDOWN, file))
            .build();

         Response response = client.newCall(request).execute();
         if (!response.isSuccessful())
             throw new IOException("Unexpected code " + response);

        System.out.println(response.body().string());
    }
```
### [Posting form parameters](https://github.com/square/okhttp/blob/master/samples/guide/src/main/java/okhttp3/recipes/PostForm.java)

用`FormBody.Builder`创建请求体是可以的就像 `HTML` 的`<form>`标签。键和值将 `URL` 编码来兼容 `HTML` 表单。

```java
    private final OkHttoClient client = new OkHttpClient();

    public void run() throws IOException {
         RequestBody formBody = new FormBody.Builder()
              .add("search", "Jurassic Park")
              .build();
         Request request =  new Request.Builder()
            .url("http://api.github.com/markdown/raw")
            .post(formBody）
            .build();

         Response response = client.newCall(request).execute();
         if (!response.isSuccessful())
             throw new IOException("Unexpected code " + response);

        System.out.println(response.body().string());
    }
```
### [Posting a multipart request](https://github.com/square/okhttp/blob/master/samples/guide/src/main/java/okhttp3/recipes/PostMultipart.java)

`MultipartBody.Builder`用于创建复杂的请求体来兼容 HTML 文件上传。复杂请求体的每一部分本事就是一个请求体，能够定义其本身的头。目前，这些头应该描述每一部分的请求体，就像它本身的`Content-Disposition`。`Content-Length`和`Content-Type`头将在可用时自动添加。
```java
    private static final String IMGUR_CLIENT_ID = "...";
    private static final MediaType MEDIA_TYPE_PNG = MediaType.parse("image/png");

    private final OkHttpClient client = new OkHttpClient();

    public void run() throws Exception {
        //Use the imgur image upload API as document at https://api.imgur.com/endpoints.image
        RequestBody requestBody = new MultipartBody.Bulder()
            .setType(MultiparBody.FORM)
            .addFormDataPart("title", "Square Logo")
            .addFormDataPart("image", "logo-square.png",
                RequestBody.create(MEDIA_TYPE_PNG, new File("website/static/logo-square.png")))
            .build();

        Request request = new Request.Builder()
            .header("Autorization", "Client-ID" + IMGUR_CLIENT_ID)
            .url("https://api.imgur.com/3/image")
            .post(requestBody)
            .build();

        Response response = client.newCall(request).execute();
        if (!response.isSuccessful())
             throw new IOException("Unexpected code " + response);

        System.out.println(response.body().string());
    }
```
### [Parse a JSON Response With Gson](https://github.com/square/okhttp/blob/master/samples/guide/src/main/java/okhttp3/recipes/ParseResponseWithGson.java)

[Gson](http://code.google.com/p/google-gson/)  是一个处理 JSON 字符串与 java 对象转换的好用的 API。这里我们使用 Gson 来解析从 GitHub API 获取的 JSON。

注意`ResponseBody.charStream()`方法将使用从响应头中获取的`Content-Type`值作为响应体的解码格式。在没有指定的情况下将使用 utf-8 作为解码格式。
```java
    private final OkHttpClient client = new OkHttpClient();
    private final Gson gson = new Gson();

    public void run() throws Exception {
        Request request = new Request.Builder()
            .url("https://api.github.com/gists.c2a7c39532239ff261be")
            .build();
        Response response = client.newCall(request).execute();
        if (!response.isSuccessful())
             throw new IOException("Unexpected code " + response);

        Gist gist = gson.fromJson(response.budy.charStream(), Gist.class);
        for (Map.Entry<String, GistFile> entry : gist.files.entrySet()) {
            System.out.println(entry.getKey());
            System.out.println(entry.getValue().content);
        }
    }

    static class Gist {
        Map<String, GistFile> files;
    }

    static class GistFile {
      String content;
    }
```
### [Response Caching](https://github.com/square/okhttp/blob/master/samples/guide/src/main/java/okhttp3/recipes/CacheResponse.java)

使用本地缓存 response 需要提供一个可以读写的缓存路径，和缓存的大小。这个缓存路径应该是私有的，不可信的应用不可以读取缓存的内容！

多个本地缓存使用同一个路径是错误的，大部分的应用都应该调用`new OkHttpClient()`的同时配置缓存，并且保证在任何地方都是使用的同一个。否则两个缓存会相互影响，污染 response 缓存，甚至使你的程序崩溃。

response 缓存会从的 HTTP 头读取配置。你可以添加一个像`Cache-Control: max-stale=3600`的请求头，OkHttp 缓存就会遵守。你的服务器通过 response 头配置 response 的缓存时间（就像`Cache-Control:max-age=9600`）。有些缓存头可以控制缓存的 response，控制一个网络缓存，或者通过可选的 GET 验证控制一个网络的 response。
```java
    private final OkHttpClient client;

    public CacheResponse(File cahceDirectory) throws Exception {
        int cacheSize = 10 * 1024 * 1024; //10MiB
        Cache cache = new Cache(cacheDirctory, cacheSize);

        client = new OkHttpClient.Builder()
            .cache(cache)
            .build();
    }

    public void run() throws Exception {
        Reques request = new Request.Builder()
            .url("http://publicobject.com/helloworld.txt")
            .build();

        Response response1 = client.newCall(request).execute();
        if(!response1.isSuccessful())
            throw new IOException("Unexpected code " + response);

        String response1Body = response1.body().string();
        System.out.println("Response 1 response:          " + response1);
        System.out.println("Response 1 cache response:    " + response1.cahceResponse());
        System.out.println("Response 1 network response:  " + response1.networkResponse());

        Response response2 = client.newCall(request).execute();
        if(!response2.isSuccessful())
            throw new IOException("Unexpected code " + response);

        String response2Body = response2.body().string();
        System.out.println("Response 2 response:          " + response2);
        System.out.println("Response 2 cache response:    " + response1.cahceResponse());
        System.out.println("Response 2 network response:  " + response2.networkResponse());

        System.out.println("Response 2 equals Response 1?:" + response1Body.equals(response2Body));
    }
```
通过使用`CacheControl.FORCE_NETWORK`可以阻止使用本地缓存，`CacheControl.FORCE_CACHE`可以阻止网络缓存。警告：如果你使用了`FORCE_CACHE`response 需要使用网络，否则 OkHttp 将返回`504 Unsatisfiable Request`response。
（\*注：关于缓存的内容可以参考[这里](http://www.jianshu.com/p/9c3b4ea108a7)）

### [Canceling a Call](https://github.com/square/okhttp/blob/master/samples/guide/src/main/java/okhttp3/recipes/CancelCall.java)

`Call.cancel()`可以立刻取消正在进行的 call。如果当前的线程正在写 request 或者读 response 将导致`IOException`。通过取消不必要的 call 可以节省流量；当你通过导航离开应用时应用的同步或异步 call 都可以被取消。
```java
    private final ScheduleExecutorService executor = Executors.newScheduledThreadPool(1);
    private final OkHttpClient client = new OkHttpCLient();

    public void run () throws Exception {
        Request request = new Request.Builder()
            .url("http://httpbin.org/delay/2")
            .build();

        final long startNanos = System.nanoTime();
        final Call call = client.newCall(request);

        // Scheduler a jod to cancel the call in 1 second.
        executor.schedule(new Runnable() {
            @Override public void run () {
                System.out.printf("%.2f Canceling call.%n", (System.nanoTime() - startNanos) / 1e9f);
                call.cancel();
                System.out.printf("%.2f Canceling call.%n", (System.nanoTime() - startNanos) / 1e9f);
            }
        }, 1, TimeUnit.SECONDS);

        try {
            System.out.prinf("%.2f Canceling call.%n", (System.nanoTime() - startNanos) / 1e9f);
           Response response = call.execute();
            System.out.prinf("%.2f Canceling call.%S%n", (System.nanoTime() - startNanos) / 1e9f, response);
        } catch(IOException e) {
            System.out.prinf("%.2f Canceling call.%S%n", (System.nanoTime() - startNanos) / 1e9f, e);
        }
    }
```
### [Timeouts](https://github.com/square/okhttp/blob/master/samples/guide/src/main/java/okhttp3/recipes/ConfigureTimeouts.java)

访问超时取消的 call 等同于网络不能访问，网络分区可能引起客户端的连接问题，或者服务器的不可用问题。OkHttp 支持设置连接，读，写的超时。
```java
    private final OkHttpClient client;

    public ConfigureTimeouts() thows Exception {
        client = new OkHttpCLient.Builder()
            .connectTimeout(10, TimeUnit.SECONDS)
            .writeTimeout(10, TimeUnit.SECONDS)
            .readeTimeout(30, TimeUnit.SECONDS)
            .build();
    }

    public void run() throws Exception {
        Requets requets = new Request.Builder()
            .url("http://httpbin.org.delay/2")
            .build();

        Response response = client.newCall(request).execute();
        System.out.prinln("Response completed: " + response);
    }
```
### [Per-call Configuration](https://github.com/square/okhttp/blob/master/samples/guide/src/main/java/okhttp3/recipes/PerCallSettings.java)

所有的 HTTP 客户端配置依赖于`OkHttpClient`，包括代理设置，超时，和缓存。当你需要改变某个 call 的配置时，调用`OkHttpClient.newBuilder()`将返回与源客户端公用 pool，dispatcher,和配置的一个构造者。在下一个例子中，我们创建了一个请求分别具有 500ms 的超时和 3000ms 的超时。
```java
    private final OkHttpClient client = new OkHttpClient();

    public void run() throws Exception {
        Request request = new Request.Builder()
            .url("http://httpbin.org/delay/1")
            .build();

        try{
            // Copy to customize Okhttp for this request.
            OkHttpClient copy = client.newBuilder()
                .readTimeout(500, TimeUnit.MILLISECONDS)
                .build();

            Response response = copy.newCall(request).execute();
            System.out.println("Response 1 succeeded: " response);
        }catch (IOException e) {
            System.out.println("Response 1 failed: " + e);
        }

      try{
            // Copy to customize Okhttp for this request.
            OkHttpClient copy = client.newBuilder()
                .readTimeout(3000, TimeUnit.MILLISECONDS)
                .build();

            Response response = copy.newCall(request).execute();
            System.out.println("Response 2 succeeded: " response);
        }catch (IOException e) {
            System.out.println("Response 2 failed: " + e);
        }
    }
```
### [Handling authentication](https://github.com/square/okhttp/blob/master/samples/guide/src/main/java/okhttp3/recipes/Authenticate.java)

当一个 request 的返回码是`401 Not Authorized`时 OkHttp 可以自动重试未授权的 requests。 `Authenticator`用于提供证书。Authenticator 的实现应该构建一个带有确实认证的 request，在没有认证可用时通过返回 null 来跳过重试。

`Response.challenges()`方法可以获取授权问题的 scheme 和 realm，`Basic` 认证可以使用`Credentials.basic(username, password)`来编码请求头。
(\*注：关于[认证](http://www.cnblogs.com/youxilua/archive/2013/06/15/3137236.html))
```java
    private final OkHttpClient client;

    public Authenticate() {
        client = new OkHttpClient.Builder()
            .authenticator(new Autenticator() {
                @Override public Request authenticate(Routr rourte, Response response) throws IOException {
                    System.out.println("Authenicating for response: " + response);
                    System.out.println("Challenges: " + response.challenges());
                    String credential = Credentials.basic("jesse", "password1");
                    return response.request().newBuilder()
                        .header("Authorization", crebential)
                        .build();
                }
            })
            .build();
    }

    public void run() tthrows Exception {
        Request request = new Request.Builder()
            .url("http://publicobjetc.com/secrets/hellosecret.txt")
            .build();

        Response response = client.newCall(request).execute();
        if (!response.isSuccessfun()) throw new IOException("Unexpected code" + response);

        System.out.println(response.body().string());
    }
```
通过返回 null 避免认证失败时的多次重试。例如在已经重试的情况下结束重试：
​  
 if(credentical.equals(response.request().header("Authorization"))) {
return null; // If We already failde with these credentials, don't retry.
}
你也可以设置重试的次数：
```java
    if (responseCount(response) >= 3) {
        return null; // If We've failed 3 times, give up.
    }

    private int responseCount(Reponse response) {
        int result = 1;
        while ((response = response.priorResponse()) != null) {
            result ++;
        }
        return result;
    }
```