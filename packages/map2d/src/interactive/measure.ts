import OlMap from 'ol/Map';
import { Vector as OlVectorSource } from 'ol/source';
import { Vector as OlVectorLayer } from 'ol/layer';
import OlFeature from 'ol/Feature';
import { Polygon as OlPolygon, LineString as OlLineString } from 'ol/geom';
import OlDraw from 'ol/interaction/Draw';
import OlOverlay from 'ol/Overlay';
import { getArea, getLength } from 'ol/sphere';
import { unByKey } from 'ol/Observable';
import { EventsKey } from 'ol/events';
import OlMapBrowserEvent from 'ol/MapBrowserEvent';
import { type InteractiveManager, getId } from './interactiveManager'
import { Interactive } from './types';
import { strokeColor, fillColor, getStyle } from '../style'
import { util } from '../shared'

function formatLength(line: OlLineString) {
  const data = getLength(line);
  let output;
  if (data > 100) {
    output = Math.round((data / 1000) * 100) / 100 + ' ' + 'km';
  } else {
    output = Math.round(data * 100) / 100 + ' ' + 'm';
  }
  return { output, data };
}

function formatArea(polygon: OlPolygon) {
  const data = getArea(polygon);
  let output;
  if (data > 10000) {
    output = Math.round((data / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>';
  } else {
    output = Math.round(data * 100) / 100 + ' ' + 'm<sup>2</sup>';
  }
  return { output, data };
}

function removeTooltip(olMap: OlMap, tooltip: ToolTip) {
  olMap.removeOverlay(tooltip.olOverlay!);
  tooltip.el?.remove();
}

function removeMeasure(olMap: OlMap, measure: Measure) {
  removeTooltip(olMap, measure.tooltip);
}

let id = 0;

function createMeasure(olMap: OlMap, type: Measure['type']) {
  id++;
  const tooltip: ToolTip = {
    message: '',
    el: null,
    olOverlay: null,
  };
  tooltip.el = document.createElement('div');
  tooltip.el.className = 'map2d-measure_tooltip';
  const measureTooltip = new OlOverlay({
    element: tooltip.el,
    offset: [0, -15],
    positioning: 'bottom-center',
    stopEvent: false,
    insertFirst: false,
  });
  tooltip.olOverlay = measureTooltip;
  olMap.addOverlay(measureTooltip);
  const measure: Measure = {
    id,
    type,
    data: undefined,
    tooltip,
  };

  return measure;
}

function createHelpTooltip(olMap: OlMap) {
  const tooltip: ToolTip = {
    message: '',
    el: null,
    olOverlay: null,
  };
  tooltip.el = document.createElement('div');
  tooltip.el.className = 'ol-tooltip hidden';
  const helpTooltip = new OlOverlay({
    element: tooltip.el,
    offset: [15, 0],
    positioning: 'center-left',
  });
  tooltip.olOverlay = helpTooltip;
  olMap.addOverlay(helpTooltip);
  return tooltip;
}

const continuePolygonMsg = '单击继续，双击结束';
const continueLineMsg = '单击继续，双击结束';

enum OlDrawType {
  distance = 'LineString',
  angle = 'LineString',
  area = 'Polygon',
}

interface ToolTip {
  message: string;
  el: HTMLElement | null;
  olOverlay: OlOverlay | null;
}

interface Measure {
  id: number;
  type: 'distance' | 'area' | 'angle';
  data?: number;
  tooltip: ToolTip;
}

export type MeasureInteractive = Interactive<{
  use(type: Measure['type']): void
  clean(): void;
}>

function getAngle(olLineString: OlLineString) {
  const coords = olLineString.getCoordinates()
  if (!coords || coords.length < 3) return 0
  const [p1, p2, p3] = coords

  // 计算第一条线的向量（基准线）
  const v1x = p1[0] - p2[0];
  const v1y = p1[1] - p2[1];
  
  // 计算第二条线的向量
  const v2x = p3[0] - p2[0];
  const v2y = p3[1] - p2[1];
  
  // 计算第一条线的角度（弧度，相对于正东方向）
  const baseAngle = Math.atan2(v1y, v1x);
  
  // 计算第二条线的角度（弧度，相对于正东方向）
  const targetAngle = Math.atan2(v2y, v2x);
  
  // 计算顺时针角度差（弧度）
  let clockwiseDiff = (targetAngle - baseAngle) % (2 * Math.PI);
  
  // 确保角度差为正（顺时针方向）
  if (clockwiseDiff < 0) {
    clockwiseDiff += 2 * Math.PI;
  }
  
  // 转换为度
  let angleDegrees = clockwiseDiff * (180 / Math.PI);
  
  // 如果顺时针角度超过180度，则返回逆时针角度（即360度减去顺时针角度）
  if (angleDegrees > 180) {
    angleDegrees = 360 - angleDegrees;
  }
  
  // 格式化角度
  const formattedAngle = Number(angleDegrees.toFixed(2));
  return formattedAngle
}

function formatAngle(olLineString: OlLineString) {
  const data = getAngle(olLineString);
  const output = data + '°';
  return { output, data };
}

function getDrawStyle() {
  return getStyle({
    stroke: {
      width: 2,
      color: strokeColor
    },
    fill: {
      color: fillColor
    },
    circle: {
      radius: 5,
      stroke: {
        color: strokeColor
      },
      fill: {
        color: fillColor,
      }
    }
  })
}

interface MeasureOptions {
  type: Measure['type']
}

export type Emit = Measure

export function createInteractive(
  interactiveManager: InteractiveManager,
  options?: MeasureOptions,
) {
  let interactive: MeasureInteractive =  interactiveManager.getInteractiveByType('measure') as MeasureInteractive
  if (interactive) {
    return interactive
  }
  const olMap = interactiveManager.getOlMap()
  const emitter = interactiveManager.getEmitter()
  const olSource = new OlVectorSource();
  const olLayer = new OlVectorLayer({
    source: olSource,
    style: getStyle({
      stroke: {
        color: strokeColor,
        width: 2
      },
      fill: {
        color: fillColor
      },
      circle: {
        radius: 7,
        fill: {
          color: fillColor
        }
      }
    })
  });

  let type = options?.type ?? 'distance'
  let olDraw: OlDraw 
  let sketch: OlFeature | null;
  let helpTooltip: ToolTip = {
    message: '',
    el: null,
    olOverlay: null,
  };

  const pointerMoveHandler = function (evt: OlMapBrowserEvent) {
    if (evt.dragging) {
      return;
    }
    let helpMsg = '单击开始测量';

    if (sketch) {
      if (type === 'distance' || type === 'angle') {
        helpMsg = continueLineMsg;
      } else {
        helpMsg = continuePolygonMsg;
      }
    }

    helpTooltip.el!.innerHTML = helpMsg;
    helpTooltip.olOverlay!.setPosition(evt.coordinate);
    helpTooltip.el?.classList.remove('hidden');
  };


  function createDraw() {
    olDraw = new OlDraw({
      source: olSource,
      type: OlDrawType[type],
      style: getDrawStyle()
    });

    olDraw.on('drawstart', function (evt) {
      sketch = evt.feature;
      let tooltipCoord = evt.target.coordinate;
      measure = createMeasure(olMap, type);
      listener = sketch.getGeometry()!.on('change', function (evt) {
        const geom = evt.target;
        let output: string;
        let data: number;
        if (type === 'distance') {
          ({ output, data } = formatLength(geom));
          tooltipCoord = geom.getLastCoordinate();
        } else if (type === 'angle') {
          ({ output, data } = formatAngle(geom));
          tooltipCoord = geom.getLastCoordinate();
        } else {
          ({ output, data } = formatArea(geom));
          tooltipCoord = geom.getInteriorPoint().getCoordinates();
        }

        console.log(geom.getCoordinates().length)

        measure!.data = data;
        measure!.tooltip.el!.innerHTML = output;
        measure!.tooltip.olOverlay!.setPosition(tooltipCoord);
      });
    });
  
    olDraw.on('drawend', () => {
      measure!.tooltip.el!.className = 'map2d-measure_tooltip';
      measure!.tooltip.olOverlay!.setOffset([0, -7]);
      measures.push(measure!);
      sketch = null;
      helpTooltip.el!.innerHTML = '单击开始测量';
      unByKey(listener);
      emitter.emit('measure', measure);
    });
  }
  createDraw()

  util.safeInsertCssRule(`.map2d-measure_tooltip {
      color: #fff;
      border-radius: 4px;
      padding: 2px 4px;
      background-color: ${strokeColor};
    }`)

  let measure: Measure | null = null;
  // 所有测量的数字集合
  let measures: Measure[] = [];
  let listener: EventsKey;
  
  function pointerAngleHandler() {
    if (type === 'angle') {
      const geom = sketch?.getGeometry()
      if (!geom) return
      const coords = (geom as OlLineString).getCoordinates()
      if (coords.length >= 4) {
        olDraw.finishDrawing()
      }
    }
  }

  interactive = {
    id: getId(),
    type: 'measure',
    enabled: false,
    enable() {
      if (interactive.enabled) return
      helpTooltip = createHelpTooltip(olMap);
      olMap.addLayer(olLayer);
      olMap.addInteraction(olDraw);
      olMap.on('pointermove', pointerMoveHandler);
      interactive.enabled = true;
      olMap.on('click', pointerAngleHandler);
    },
    use(measureType: Measure['type']) {
      interactive.clean()
      helpTooltip = createHelpTooltip(olMap);
      type = measureType
      sketch = null;
      olMap.removeInteraction(olDraw);
      olDraw.dispose()
      unByKey(listener);
      createDraw()
      if (interactive.enabled) {
        olMap.addInteraction(olDraw);
      }
    },
    clean() {
      olSource.clear();
      removeTooltip(olMap, helpTooltip);
      for (const item of measures) {
        removeMeasure(olMap, item);
      }
      measures = [];
    },
    close() {
      if (!interactive.enabled) return
      interactive.clean();
      olMap.removeLayer(olLayer);
      olMap.removeInteraction(olDraw);
      olMap.un('pointermove', pointerMoveHandler);
      olMap.un('click', pointerAngleHandler);
      interactive.enabled = false;
    },
    destroy() {
      interactive.clean()
      interactive.close()
      olDraw.dispose()
    }
  };

  interactiveManager.add(interactive)
  return interactive;
}
