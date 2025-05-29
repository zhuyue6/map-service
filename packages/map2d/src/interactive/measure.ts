import OlMap from 'ol/Map';
import { Vector as OlVectorSource } from 'ol/source';
import { Vector as OlVectorLayer } from 'ol/layer';
import OlFeature from 'ol/Feature';
import { Polygon as OlPolygon, LineString as OlLineString } from 'ol/geom';
import OlDraw from 'ol/interaction/Draw';
import { Style, Fill, Stroke, Circle } from 'ol/style';
import OlOverlay from 'ol/Overlay';
import { getArea, getLength } from 'ol/sphere';
import { unByKey } from 'ol/Observable';
import { EventsKey } from 'ol/events';
import OlMapBrowserEvent from 'ol/MapBrowserEvent';
import { type InteractiveManager, getId } from './interactiveManager'
import { Interactive } from './types';

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
  tooltip.el.className = 'ol-tooltip ol-tooltip-measure';
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

const continuePolygonMsg = 'Click to continue drawing the polygon';
const continueLineMsg = 'Click to continue drawing the line';

enum OlDrawType {
  distance = 'LineString',
  area = 'Polygon',
}

interface ToolTip {
  message: string;
  el: HTMLElement | null;
  olOverlay: OlOverlay | null;
}

interface Measure {
  id: number;
  type: 'distance' | 'area';
  data?: number;
  tooltip: ToolTip;
}

export type MeasureInteractive = Interactive<{
  use(type: Measure['type']): void
  clean(): void;
}>

function getDrawStyle() {
  return new Style({
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.2)',
    }),
    stroke: new Stroke({
      color: 'rgba(0, 0, 0, 0.5)',
      lineDash: [10, 10],
      width: 2,
    }),
    image: new Circle({
      radius: 5,
      stroke: new Stroke({
        color: 'rgba(0, 0, 0, 0.7)',
      }),
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.2)',
      }),
    }),
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
    style: {
      'fill-color': 'rgba(255, 255, 255, 0.2)',
      'stroke-color': '#ffcc33',
      'stroke-width': 2,
      'circle-radius': 7,
      'circle-fill-color': '#ffcc33',
    },
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
    let helpMsg = 'Click to start drawing';

    if (sketch) {
      if (type === 'distance') {
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
        } else {
          ({ output, data } = formatArea(geom));
          tooltipCoord = geom.getInteriorPoint().getCoordinates();
        }
  
        measure!.data = data;
        measure!.tooltip.el!.innerHTML = output;
        measure!.tooltip.olOverlay!.setPosition(tooltipCoord);
      });
    });
  
    olDraw.on('drawend', function () {
      measure!.tooltip.el!.className = 'ol-tooltip ol-tooltip-static';
      measure!.tooltip.olOverlay!.setOffset([0, -7]);
      measures.push(measure!);
      sketch = null;
      unByKey(listener);
      emitter.emit('measure', measure);
    });
  }
  createDraw()

  let measure: Measure | null = null;
  // 所有测量的数字集合
  let measures: Measure[] = [];
  let listener: EventsKey;
  
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
