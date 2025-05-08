import OlView from 'ol/view'
import OlMap from 'ol/Map'
import { Container } from '../container'

type Coord = [number, number]
const ratioZoom = 725
const initZoom = 14
const maxZoom = 22
const minZoom = 11
export interface View {
  setCenter(coord: Coord): void
  setRotation(angle: number): void
  getZoom(): number | undefined
  setZoom(zoom: number): void
  setMinZoom(zoom: number): void
  setMaxZoom(zoom: number): void
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
  olView.setMinZoom(zoom)
}

export function setMinZoom(olView: OlView, zoom: number) {
  olView.setMinZoom(zoom)
}

export function setMaxZoom(olView: OlView, zoom: number) {
  olView.setMaxZoom(zoom)
}

function getZoomByOptions(width: number, height: number, minZoom: number,  maxZoom: number) {
  let zoom: number | string = ((width > height ? width : height) / ratioZoom).toFixed(1)
  zoom = Number.isNaN(Number(zoom)) ? initZoom : Number(zoom)
  zoom = zoom > maxZoom ? maxZoom : zoom
  zoom = zoom < minZoom ? minZoom : zoom
  return zoom
}

export interface ViewOptions {
  maxZoom: number
  minZoom: number
}

export function createView(olMap: OlMap, container: Container, options?: ViewOptions): View {
  const baseMapExtent = container.baseMap.getExtent()
  const width = baseMapExtent[2] - baseMapExtent[0]
  const height = baseMapExtent[3] - baseMapExtent[1]
  const viewMinZoom = options?.minZoom ?? minZoom
  const viewMaxZoom = options?.maxZoom ?? maxZoom
  const zoom: number = getZoomByOptions(width, height, viewMinZoom, viewMaxZoom)
  const olView: OlView = new OlView({
    center: [width / 2, height / 2],
    zoom,
    maxZoom,
    minZoom
  })
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
  }
  return view
}
