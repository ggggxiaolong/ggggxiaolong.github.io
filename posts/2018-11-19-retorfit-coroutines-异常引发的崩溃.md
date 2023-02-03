---
title: Retorfit Coroutines 异常引发的崩溃
date: 2018-11-19 12:00:00
categories:
 - Android
tags:
 - Retorfit
 - Coroutines
---

最近项目中突然爆发了一波由网络超时造成的崩溃问题(之前也有过几次,但是没有引起足够的重视).花费了一天的时间终于解决了[开心]
#### 事情是这样的:
我在项目中使用```kotlin```作为开发语言,同时也引入了```coroutnies(协程)```,使用协程替代了线程池.想要在api层使用协程,于是```Github```一波决定引入 [JakeWharton](https://github.com/JakeWharton)/**[retrofit2-kotlin-coroutines-adapter](https://github.com/JakeWharton/retrofit2-kotlin-coroutines-adapter)** 

1. 一开始还觉得很诡异,因为我在网络请求的外围写了``` try cache``` 捕获异常然后交给个上层做处理,而且不是所有的网络超时异常都捕获不到 
2. 通过打印日志发现只有在页面销毁调的时候会引发异常
3. 继续跟踪发现在页面销毁的时候调用```coroutines```的```job```取消协程时网络请求并没用被取消. 上一段[代码](https://github.com/JakeWharton/retrofit2-kotlin-coroutines-adapter/blob/master/src/main/java/com/jakewharton/retrofit2/adapter/kotlin/coroutines/CoroutineCallAdapterFactory.kt):


```kotlin
private class BodyCallAdapter<T>(
      private val responseType: Type
  ) : CallAdapter<T, Deferred<T>> {

    override fun responseType() = responseType

    override fun adapt(call: Call<T>): Deferred<T> {
      val deferred = CompletableDeferred<T>()

      deferred.invokeOnCompletion {
        if (deferred.isCancelled) {
          // 这里打印日志
          call.cancel()
        }
      }

      call.enqueue(object : Callback<T> {
        override fun onFailure(call: Call<T>, t: Throwable) {
          // 这里打印日志
          deferred.completeExceptionally(t)
        }

        override fun onResponse(call: Call<T>, response: Response<T>) {
          if (response.isSuccessful) {
            deferred.complete(response.body()!!)
          } else {
            deferred.completeExceptionally(HttpException(response))
          }
        }
      })

      return deferred
    }
  }
```

 发现```cancle```的日志在```onFailuer```后面,debug去看才发现原来```deferred.isCancelled``` 返回true是因为```deferred.completeExceptionally(t)``` 触发的. 如果是这种原因才触发取消网络请求那取消就没有意义了
下面这两个是这个库的issues:
[1]  [[Question] Coroutine cancellation is not handled, right? #7](
 https://github.com/JakeWharton/retrofit2-kotlin-coroutines-adapter/issues/7)
[2] [Is there any way to catch timeout exception using your coroutines?](https://github.com/JakeWharton/retrofit2-kotlin-coroutines-adapter/issues/33)
想了半天也没办法把```job```或者```coroutinesContext```传给api返回的```Deferred```对象,而且```suspend```方法也不能获取 ```coroutinesContext```对象所以最终只能在调用的时候把```job```
对象作为参数传到下层了...虽然不优雅但是能解决问题了 
> 如果你也遇到了这样的问题希望我的解决方法能给你一个思路,如果你有更好的解决方法请你也告诉我一声 :D
> 写一下伪代码:


```kotlin
// api service
fun api(): Deferred<String> = CompletableDeferred()

class Activity(): CoroutineScope {
  val job = Job()
  override val coroutineContext: CoroutineContext = Dispatchers.Default + job

  fun runApi(){
    launch {
      val deferred = api()
      job.invokeOnCompletion {
        if (job.isCancelled)
         // 在检测到job取消的时候取消网络请求
          deferred.cancel()
      }
      try{
        val result = deferred.await()
        //todo
      } catch (t: Throwable){
        // exception control
      }
    }
  }

  fun destory(){
    job.cancel()
  }

}
```

#### emmm  还是打算插一句为什么要使用这个库:
由于网络请求是超时操作,而安卓的页面[activity, fragment]什么时候销毁一般是由用户操作决定的.所以会有生命周期不一致的问题,网络请求又会持有页面的索引[内部类,会持有外部类的索引].所以在设计的时候一般会在页面销毁的时候取消网络请求,最开始使用的是```RxJava + CompositeDisposable ``` 在页面销毁的时候通过调用 ```CompositeDisposable``` 的 close 方法取消网络请求,之后使用``` LiveData + RxJava + AutoDispose ``` 后来觉得既然引入了```LiveData``` 在引入 ```RxJava```有些多余了(因为大部分RxJava的使用场景都在网络请求上),同时也接触了 ```koltin``` 的```coroutnies``` 找到了大神写的库竟然不用关心网络请求的取消[嗯,大神就是大神]于是就引入了...