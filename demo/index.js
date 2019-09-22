import React from 'react';
import { Button } from 'antd';
import F2 from '@antv/f2';
import { BaseComponent } from '@/pages/Layout';
import f2shim from '../index';

const {
  FunctionUsage, Card,
} = BaseComponent;

// F2 对数据源格式的要求，仅仅是 JSON 数组，数组的每个元素是一个标准 JSON 对象。
const gData = Array.from({ length: 5 }, (v, index) => index).reduce((temp, a) => temp.concat(['贝壳贝壳贝壳贝壳', '链家', '贝壳集团', '境内', '境外', '短发假发',
  '贝壳1', '链家1', '贝壳集团1', '境内1', '境外1'].map(item => ({
  time: `5-${a}`,
  type: item,
  value: parseInt(Math.random() * 100, 10),
}))), []);


export default class Charts extends React.PureComponent {
  componentWillMount() {
    const script = document.createElement('script');
    script.setAttribute('src', 'https://gw.alipayobjects.com/os/antv/assets/lib/jquery-3.2.1.min.js');
    const script1 = document.createElement('script');
    script1.setAttribute('src', 'https://gw.alipayobjects.com/os/rmsportal/NjNldKHIVQRozfbAOJUW.js');
    document.body.appendChild(script);
    document.body.appendChild(script1);
  }

  componentDidMount() {
    this.renderLine();
    this.renderBar();
  }

  componentWillUnmount() {
    window.location.reload();
  }

  addLineData = () => {
    const data = Array.from({ length: 5 }, (v, index) => index).reduce((temp, a) => temp.concat(['贝壳贝壳贝壳贝壳', '链家', '贝壳集团', '境内', '境外', '短发假发',
      '贝壳1', '链家1', '贝壳集团1', '境内1', '境外1', '链家11', '贝壳集团11', '境内11', '境外11'].map(item => ({
      time: `5-${a}`,
      type: item,
      value: parseInt(Math.random() * 100, 10),
    }))), []);
    this.chart.changeData(data);
  }

  renderLine = () => {
    // Step 1: 创建 Chart 对象
    const chart = new F2.Chart({
      // id: 'demo',
      el: document.querySelector('#demo'),
      height: 300,
      pixelRatio: window.devicePixelRatio, // 指定分辨率
      plugins: f2shim,
    });
    this.chart = chart;

    // Step 2: 载入数据源
    chart.source(gData);

    chart.tooltip({
      // layout: 'vertical',
      custom: true,
      showCrosshairs: false,
      showTitle: true,
      modifiers: {
        preventOverflow: {
          boundariesElement: document.querySelector('#demo').parentElement,
        },
      },
    });

    // Step 3：创建图形语法，绘制柱状图，由 time 和 value 两个属性决定图形位置，time 映射至 x 轴，value 映射至 y 轴
    chart.line().position('time*value').color('type');

    // Step 4: 渲染图表
    chart.render();
  }

  renderBar = () => {
    // Step 1: 创建 Chart 对象
    const chart = new F2.Chart({
      id: 'demo2',
      height: 300,
      pixelRatio: window.devicePixelRatio, // 指定分辨率
      plugins: f2shim,
    });

    // this.chart = chart;

    // Step 2: 载入数据源
    chart.source(gData);

    chart.legend('type', {
      position: 'bottom',
    });

    chart.coord({
      transposed: true,
    });


    chart.tooltip({
      // layout: 'vertical',
      custom: true,
      showCrosshairs: false,
      showTitle: true,
      modifiers: {
        preventOverflow: {
          boundariesElement: document.querySelector('#demo2').parentElement,
        },
      },
    });

    // Step 3：创建图形语法，绘制柱状图，由 time 和 value 两个属性决定图形位置，time 映射至 x 轴，value 映射至 y 轴
    chart.interval().position('time*value').color('type').adjust({
      type: 'dodge',
      marginRatio: 0.05, // 设置分组间柱子的间距
    });

    // Step 4: 渲染图表
    chart.render();
  }

  render() {
    return (
      <BaseComponent>
        <FunctionUsage config={{
          Desc: [
            <p>移动端图表库F2的垫片插件</p>,
            <p>目前支持tooltip，legend自适应， 使用如下：</p>,
            <p>
              {
                `const chart = new F2.Chart({
                  plugins: f2shim
                });`
              }
            </p>,
          ],
        }}
        />
        <Card title="折线图">
          <div style={{
            pointerEvents: 'auto', maxWidth: '395px', border: '1px solid black', height: '590px', margin: '34px auto 0', overflow: 'auto',
          }}
          >
            <Button type="primary" onClick={this.addLineData}>添加</Button>
            <div className="chart-wrapper">
              <canvas style={{ width: '100%' }} id="demo" />
            </div>
          </div>
        </Card>
        <Card title="柱状图">
          <div style={{
            pointerEvents: 'auto', maxWidth: '395px', border: '1px solid black', height: '590px', margin: '34px auto 0', overflow: 'auto',
          }}
          >
            <div className="chart-wrapper">
              <canvas style={{ width: '100%' }} id="demo2" />
            </div>
          </div>
        </Card>
      </BaseComponent>

    );
  }
}
