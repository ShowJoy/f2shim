# f2shim
一个提供legend高度自适应，tooltip脱离canvas的[F2](https://github.com/antvis/f2)插件

# 安装
```
npm install --save f2shim
```

# 使用说明
1. 创建一个只包含`canvas`元素的`div`（如果使用到插件的tooltip需要这么做）:
   ```html
    <div>
      <canvas style="width: 100%" id="demo"></canvas>
    </div>
   ```
2. 使用
   ```js
    import f2shim from 'f2shim';
    const chart = new F2.Chart({
      id: 'demo',
      height: 300,
      pixelRatio: window.devicePixelRatio,
      plugins: f2shim, // 引入插件
    });
   ```

# 配置
1. 插件tooltip只有在custom为true下有效,如果自定义tooltip又不需要使用插件的，需要如下配置：
   ```js
     chart.tooltip({
       custom: true,
       onChange() {
         // do something
         return false;
       },
       onHide() {
         // do something
         return false;
       }
     })
   ```
2. tooltip的方向配置，内部采用[popper.js](https://github.com/FezVrasta/popper.js), 其配置都支持, 如设置tooltip溢出的范围元素:
   ``` js
    chart.tooltip({
      modifiers: {
        preventOverflow: {
          boundariesElement: document.querySelector('#demo').parentElement,
        },
      },
    })
   ```
3. tooltip样式不满足，可以自己更具元素类名覆盖内置样式
4. 关掉legend高度自适应，配置autoSize为false：
   ```js
   const chart = new F2.Chart({
      id: 'demo',
      height: 300,
      autoSize: false,
      pixelRatio: window.devicePixelRatio,
      plugins: f2shim, // 引入插件
    });
   ```