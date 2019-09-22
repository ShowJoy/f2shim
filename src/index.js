import Popper from './popper';
import './index.css';

function insertAfter(newElement, targetElement) {
  const parent = targetElement.parentNode;
  if (parent.lastChild === targetElement) {
    // 如果最后的节点是目标元素，则直接添加。因为默认是最后
    parent.appendChild(newElement);
  } else {
    // 如果不是，则插入在目标元素的下一个兄弟节点 的前面。也就是目标元素的后面
    parent.insertBefore(newElement, targetElement.nextSibling);
  }
}

class F2Shim {
  constructor(chart) {
    this.chart = chart;
    // 点击点
    this.clickedEL = document.createElement('div');
    this.clickedEL.setAttribute('class', 'f2-clicked');
    // tooltip
    this.tooltipEL = document.createElement('div');
    this.tooltipEL.setAttribute('class', 'f2-tooltip');

    const canvasDom = chart.get('canvas').get('el');
    canvasDom.parentNode.classList.add('f2-chart-wrapper');
    insertAfter(this.clickedEL, canvasDom);
    insertAfter(this.tooltipEL, canvasDom);
  }

  adjustCanvasHeight() {
    const { chart } = this;
    const legendRange = chart.get('legendRange');
    const height = chart.get('originHeight') + (legendRange ? (legendRange.top || legendRange.bottom) : 0);
    const width = chart.get('width');
    const canvas = chart.get('canvas');
    canvas.changeSize(width, height);
    chart.set('height', height);
    chart.set('width', width);
  }

  tooltip(config) {
    const $this = this;
    const {
      content, custom, onChange, onHide, showTitle, placement = 'right', modifiers,
    } = config;
    if (custom) {
      config.onChange = (ev) => {
        const ret = onChange && onChange(ev);
        if (ret === false) { return; }
        const { items } = ev;
        let html = '<div class="f2-tooltip__arrow" x-arrow></div>';
        let maxY = items[0].y;
        let minY = items[0].y;
        let maxX = items[0].x;
        let minX = items[0].x;
        if (showTitle && !content) {
          html += '<div class="f2-tooltip-title">title</div>';
        }

        items.forEach((item) => {
          if (item.y > maxY) {
            maxY = item.y;
          }
          if (item.y < minY) {
            minY = item.y;
          }
          if (item.x > maxX) {
            maxX = item.x;
          }
          if (item.x < minX) {
            minX = item.x;
          }
          html += content ? content(item) : `<div class="f2-tooltip-item">
            <i class="f2-tooltip-item-left" style="background-color: ${item.color}"></i>
            <div class="f2-tooltip-item-right">
              <label>${item.name}：</label>
              <span>${item.value}</span>
            </div>
          </div>`;
        });

        $this.tooltipEL.innerHTML = html;
        $this.tooltipEL.style.opacity = 1;
        $this.clickedEL.style.left = `${minX + (maxX - minX) / 2}px`;
        $this.clickedEL.style.top = `${minY + (maxY - minY) / 2}px`;

        new Popper($this.clickedEL, $this.tooltipEL, { // eslint-disable-line
          placement,
          // https://github.com/FezVrasta/popper.js/blob/master/docs/_includes/popper-documentation.md#modifiers--object
          modifiers: Object.assign({
            offset: {
              offset: '0px, 3px',
            },
            preventOverflow: {
              boundariesElement: 'viewport',
            },
          }, modifiers),
        });
      };

      config.onHide = (e) => {
        const ret = onHide && onHide(e);
        if (ret === false) { return; }
        $this.tooltipEL.style.opacity = 0;
        $this.tooltipEL.style.left = '-10000px';
      };
    }
    return config;
  }
}

export default {
  init(chart) {
    const shim = new F2Shim(chart);
    chart.set('f2shim', shim);
    chart.set('originHeight', chart.get('height'));
  },
  // beforeGeomInit(chart) {
  //   console.log('beforeGeomDraw', chart.get('legendRange'))
  // },
  beforeGeomDraw(chart) {
    const shim = chart.get('f2shim');

    const tooltipController = chart.get('tooltipController');
    if (tooltipController.cfg) {
      tooltipController.cfg = shim.tooltip(tooltipController.cfg);
    }
    // console.log('beforeGeomDraw', chart.get('legendRange'))
    shim.adjustCanvasHeight();
  },
  // changeData(chart) {
  //   console.log('changeData');
  // },
  // afterGeomDraw(chart) {
  //   console.log('afterGeomDraw', chart.get('legendRange'))
  // },
  // beforeCanvasDraw(chart) {
  //   console.log('beforeCanvasDraw', chart.get('legendRange'))
  // }
};
