import OlMap from 'ol/Map'
import OlImageStatic from 'ol/source/ImageStatic'
import OlProjection from 'ol/proj/Projection'
import OlImage from 'ol/layer/Image'
import { Layer as OlLayer } from 'ol/layer'

export type Extent = [number, number, number, number]
const extent: Extent = [0, 0, 10000, 10000];
const fullExtent: Extent = [-20026376.39, -20048966.10, 20026376.39, 20048966.10];
const baseColor = '#fff'
const baseBgColor = '#eee'

export interface BaseMap {
  getExtent(): Extent
  setExtent(extent: Extent): void
  setImage(url?: string): void
  getOlLayer(): OlLayer
  clean(): void
}

export interface BaseMapOptions {
  url?: string
  extent?: Extent
}


function createSolidColorImage(color: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 500;
  canvas.height = 500;
  const ctx = canvas.getContext('2d');
  ctx!.fillStyle = color;
  ctx!.fillRect(0, 0, 500, 500);
  return canvas.toDataURL();
}

function getBaseMap(extent: Extent, olProjection:OlProjection,  url: string) {
  const olImageSource =  new OlImageStatic({
    url,
    projection: olProjection,
    imageExtent: extent
  })

	const olLayer = new OlImage({
    source: olImageSource
	});

  return olLayer
}

export function createBaseMap(olMap: OlMap, options?: BaseMapOptions): BaseMap {
  // 底图
  let baseMapExtent = options?.extent ?? extent
  let baseMapUrl = options?.url ?? ''

  if (!baseMapUrl) {
    baseMapUrl = createSolidColorImage(baseColor)
  }
  const olProjection = new OlProjection({
    code: 'EPSG:3857',
    extent
	});
	const olLayer = getBaseMap(baseMapExtent, olProjection, baseMapUrl)

  // 底图背景
  const olProjectionBg = new OlProjection({
    code: 'EPSG:3857',
    extent: fullExtent
	});
  const bgUrl = createSolidColorImage(baseBgColor)
  const olLayerBg = getBaseMap(fullExtent, olProjectionBg, bgUrl)

  olMap.addLayer(olLayerBg)
  olMap.addLayer(olLayer)

  const baseMap: BaseMap = {
    getExtent() {
      return baseMapExtent
    },
    setExtent(extent: Extent) {
      olProjection.setExtent(extent)
      baseMapExtent = extent
      baseMap.setImage()
    },
    setImage(imageUrl?: string) {
      const url = imageUrl ?? baseMapUrl
      const olImageSource =  new OlImageStatic({
        url,
        projection: olProjection,
        imageExtent: baseMapExtent
      })
      olLayer.setSource(olImageSource)
      baseMapUrl = imageUrl ?? baseMapUrl
    },
    getOlLayer() {
      return olLayer
    },
    clean() {
      olLayer.dispose()
      olLayerBg.dispose()
      olMap.removeLayer(olLayer)
      olMap.removeLayer(olLayerBg)
    }
  }
  return baseMap
}