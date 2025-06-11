import { Emitter } from './emitter';
import OlMap from 'ol/map';
import MapBrowserEvent from 'ol/MapBrowserEvent';

export function useMapEvent(emitter: Emitter, olMap: OlMap) {
  function clickEmitter(event: MapBrowserEvent) {
    emitter.emit('click', event);
  }

  function moveEmitter(event: MapBrowserEvent) {
    emitter.emit('move', event);
  }

  olMap.on('click', clickEmitter);
  olMap.on('pointermove', moveEmitter);

  return function () {
    olMap.un('click', clickEmitter);
    olMap.un('pointermove', moveEmitter);
  };
}
