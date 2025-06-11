import OlView from 'ol/view'
import OlMap from 'ol/Map'
import { MouseWheelZoom as OlMouseWheelZoom, DoubleClickZoom as OlDoubleClickZoom } from 'ol/interaction'
import { Container, Extent } from '../container'

type Coord = [number, number]
const maxZoom = 26
const minZoom = 10
export interface View {
  setCenter(coord: Coord): void
  setRotation(angle: number): void
  getZoom(): number | undefined
  setZoom(zoom: number): void
  setMinZoom(zoom: number): void
  setMaxZoom(zoom: number): void
  fit(extent: Extent):void
}

export function setCenter(olView: OlView, coord: Coord) {
  olView.setCenter(coord)
}

export function setRotation(olView: OlView, rotation: number) {
  olView.setRotation(rotation)
}

export function getZoom(olView: OlView) {
  return olView.getZoom()
}

export function setZoom(olView: OlView, zoom: number) {
  olView.setZoom(zoom)
}

export function setMinZoom(olView: OlView, zoom: number) {
  olView.setMinZoom(zoom)
}

export function setMaxZoom(olView: OlView, zoom: number) {
  olView.setMaxZoom(zoom)
}

export function fit(olView: OlView, extent: Extent) {
  olView.fit(extent)
}

export type ViewOptions = Partial<{
  useMouseZoom: boolean
  maxZoom: number
  minZoom: number
}>

export function createView(olMap: OlMap, container: Container, options?: ViewOptions): View {
  const baseMapExtent = container.baseMap.getExtent()
  const width = baseMapExtent[2] - baseMapExtent[0]
  const height = baseMapExtent[3] - baseMapExtent[1]
  const olView: OlView = new OlView({
    center: [width / 2, height / 2],
    maxZoom: options?.maxZoom ?? maxZoom,
    minZoom: options?.minZoom ?? minZoom,
  })

  const mouseWheelZoom = olMap.getInteractions().getArray().find(
    interaction => interaction instanceof OlMouseWheelZoom
  );

  // 是否禁用鼠标滚轮缩放
  const useMouseZoom = options?.useMouseZoom === undefined ? true : options?.useMouseZoom
  if (!useMouseZoom && mouseWheelZoom) {
    mouseWheelZoom.setActive(false);
  }
  // 禁用双击缩放交互
  const olDoubleClickZoom = olMap.getInteractions().getArray().find(
    interaction => interaction instanceof OlDoubleClickZoom
  );
  if (!useMouseZoom && olDoubleClickZoom) {
    olDoubleClickZoom.setActive(false);
  }

  olMap.setView(olView)
  const view: View = {
    setCenter(coord: Coord) {
      olView.setCenter(coord)
    },
    setRotation(rotation: number) {
      setRotation(olView, rotation)
    },
    getZoom() {
      return getZoom(olView)
    },
    setZoom(zoom: number) {
      setZoom(olView, zoom)
    },
    setMinZoom(zoom: number) {
      setMinZoom(olView, zoom)
    },
    setMaxZoom(zoom: number) {
      setMaxZoom(olView, zoom)
    },
    fit(extent: Extent) {
      fit(olView, extent)
    },
  }
  view.fit(baseMapExtent)
  return view
}
