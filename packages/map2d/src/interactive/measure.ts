import OlMap from 'ol/Map';
import { Vector as OlVectorSource} from 'ol/source';
import { Vector as OlVectorLayer } from 'ol/layer';
import OlFeature from 'ol/Feature'
import { Polygon as OlPolygon, LineString as OlLineString } from 'ol/geom'
import OlDraw from 'ol/interaction/Draw';
import { Style, Fill, Stroke, Circle } from 'ol/style';
import OlOverlay from 'ol/Overlay'
import {getArea, getLength} from 'ol/sphere';
import { unByKey } from 'ol/Observable'
import { EventsKey } from 'ol/events'
import OlMapBrowserEvent from 'ol/MapBrowserEvent'
import { emitter } from '../events'
import { InteractiveEvent } from './types'

function formatLength(line: OlLineString) {
  const length = getLength(line);
  let output;
  if (length > 100) {
    output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
  } else {
    output = Math.round(length * 100) / 100 + ' ' + 'm';
  }
  return { output, length };
}

function formatArea(polygon: OlPolygon) {
  const area = getArea(polygon);
  let output;
  if (area > 10000) {
    output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>';
  } else {
    output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
  }
  return { output, area };
}

function createMeasureTooltip(olMap: OlMap, tooltip: ToolTip) {
  if (tooltip.el) {
    tooltip.el.parentNode!.removeChild(tooltip.el);
  }
  tooltip.el = document.createElement('div');
  tooltip.el.className = 'ol-tooltip ol-tooltip-measure';
  const measureTooltip = new OlOverlay({
    element: tooltip.el,
    offset: [0, -15],
    positioning: 'bottom-center',
    stopEvent: false,
    insertFirst: false,
  });
  tooltip.olOverlay = measureTooltip
  olMap.addOverlay(measureTooltip);
}

function createHelpTooltip(olMap: OlMap, tooltip: ToolTip) {
  if (tooltip.el) {
    tooltip.el.parentNode!.removeChild(tooltip.el);
  }
  tooltip.el = document.createElement('div');
  tooltip.el.className = 'ol-tooltip hidden';
  const helpTooltip = new OlOverlay({
    element: tooltip.el,
    offset: [15, 0],
    positioning: 'center-left',
  });
  tooltip.olOverlay = helpTooltip
  olMap.addOverlay(helpTooltip);
}

interface ToolTip {
  message: string
  el: HTMLElement | null
  olOverlay: OlOverlay | null
}

const continuePolygonMsg = 'Click to continue drawing the polygon';
const continueLineMsg = 'Click to continue drawing the line';

enum OlDrawType {
  distance = 'LineString',
  area = 'Polygon'
}

interface Measure {
  type: 'distance' | 'area'
  length?: number
  area?: number
}

export type EventType = 'measure' | keyof InteractiveEvent

export function createMeasureInteractive(olMap: OlMap, type: 'distance' | 'area', emitter: emitter.Emitter) {
  const source = new OlVectorSource()
  const vector = new OlVectorLayer({
    source: source,
    style: {
      'fill-color': 'rgba(255, 255, 255, 0.2)',
      'stroke-color': '#ffcc33',
      'stroke-width': 2,
      'circle-radius': 7,
      'circle-fill-color': '#ffcc33',
    },
  });


  const olDraw = new OlDraw({
    source: source,
    type: OlDrawType[type],
    style: new Style({
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
    }),
  });
  let sketch: OlFeature | null
  const helpTooltip: ToolTip = {
    message: '',
    el: null,
    olOverlay: null
  };
  const measureTooltip: ToolTip = {
    message: '',
    el: null,
    olOverlay: null
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

  const measure: Measure = {
    type
  }
  
  let listener: EventsKey;
  createHelpTooltip(olMap, helpTooltip)
  createMeasureTooltip(olMap, measureTooltip)
  olDraw.on('drawstart', function (evt) {
    sketch = evt.feature;
    let tooltipCoord = evt.target.coordinate;

    listener = sketch.getGeometry()!.on('change', function (evt) {
      const geom = evt.target;
      let output: string
      let length: number
      let area: number
      if (type === 'distance') {
        ({ output, length } = formatLength(geom));
        tooltipCoord = geom.getLastCoordinate();
      } else {
        ({ output, area } = formatArea(geom));
        tooltipCoord = geom.getInteriorPoint().getCoordinates();
      }
      
      measure.length = length!
      measure.area = area!

      measureTooltip.el!.innerHTML = output;
      measureTooltip.olOverlay!.setPosition(tooltipCoord);
    });
  });

  olDraw.on('drawend', function () {
    measureTooltip.el!.className = 'ol-tooltip ol-tooltip-static';
    measureTooltip.olOverlay!.setOffset([0, -7]);
    sketch = null;
    measureTooltip.el = null;
    createMeasureTooltip(olMap, measureTooltip);
    unByKey(listener);
    emitter.emit('measure', measure)
  });
  return {
    enable() {
      olMap.addLayer(vector)
      olMap.addInteraction(olDraw)
      olMap.on('pointermove', pointerMoveHandler);
      emitter.emit('enable')
    },
    close() {
      olMap.removeLayer(vector)
      olMap.removeInteraction(olDraw)
      olMap.un('pointermove', pointerMoveHandler);
      emitter.emit('close')
    }
  }
}