# Promise  学习
> [文档地址] (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) <br/>
> Promise函数用来反应异步方法最终执行完成之后（成功/失败），以及结果值。<br/>
> `Promise`方法的参数是一个函数 `function(resolve, reject){}`, 这个函数具有两个参数`resolve`和`reject`。<br/>
> 其中`resolve`方法是在整个`Promise`执行完成并且获取成功之后执行的内容，传递给`resolve`的参数最终将会在`Promise.then(onFulfilled[, onRejected])`的`onFulfilled`函数中找到。<br/>
> 而`reject`方法则是在整个`Promise`执行完成并失败之后执行，传递给`reject`的参数最终可以在`Promise.then(onFulfilled[, onRejected])`中的`onRejected`函数中以及`Promise.catch(onRejected)`中的`onRejected`函数中找到。<br/>
> 下面是一个Promise的例子<br/>

```javascript

/**
 * 返回一个Promise函数，用来等待异步方法执行完成
 * @param {*} timeName  计时器名字 
 * @param {*} timer  等待时间 
 */
const promiseDemoFunc = (timeName,timer) => new Promise((resolve, reject) => {
    var startTime = 0;
    var step = 100;
    var call = (endTime)=>{
        if(startTime < endTie){
            startTime += step;
            setTimeout(
                ()=>{
                    console.log(timeName, startTime);
                    call(timer);
                },
                startTime 
            );
        }else{
            resolve('resolve ' + timeName + ':' + startTime);
        }
    }

    call(timer);

});

var promiseDemo = () => {
    var promise1 = promiseDemoFunc('timer1',1000);
    var promise2 = promiseDemoFunc('timer2',500);

    var resolve1,resolve2;

    //当传递的promise全部执行完之后，执行的后续工作
    Promise.all([promise1,promise2]).then((values)=>{
        resolve1 = values[0];
        resolve2 = values[1];

        console.log('resolve1:',resolve1);
        console.log('resolve2',resolve2);
    })
}

promiseDemo();

```

> 执行结果<br/>
``` CMD
> timer1 100
> timer2 100
> timer1 200
> timer2 200
> timer1 300
> timer2 300
> timer1 400
> timer2 400
> timer1 500
> timer2 500
> timer1 600
> timer1 700
> timer1 800
> timer1 900
> timer1 1000
> resolve1: resolve timer1:1000
> resolve2 resolve timer2:500
```

