import OlImageStatic from 'ol/source/ImageStatic'
import OlProjection from 'ol/proj/Projection'
import OlImage from 'ol/layer/Image'
import { Layer as OlLayer } from 'ol/layer'

type Extent = [number, number, number, number]
const extent: Extent = [0, 0, 10000, 10000];

export interface BaseMap {
  getExtent(): Extent
  setExtent(extent: Extent): void
  setImage(url?: string): void
  getOlLayer(): OlLayer
}

export interface BaseMapOptions {
  url?: string
  extent?: Extent
}

export function createBaseMap(options?: BaseMapOptions): BaseMap {
  let baseMapExtent = options?.extent ?? extent
  let baseMapUrl = options?.url ?? ''
	const olProjection = new OlProjection({
    code: 'EPSG:3857',
    extent: baseMapExtent
	});

  const olImageSource =  new OlImageStatic({
    url: baseMapUrl,
    projection: olProjection,
    imageExtent: baseMapExtent
  })

	const olLayer = new OlImage({
    source: olImageSource
	});

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
    }
  }
  return baseMap
}