import EsriMap = require("esri/Map");
import Basemap = require("esri/Basemap");
import WMTSLayer = require("esri/layers/WMTSLayer");
import SceneView = require("esri/views/SceneView");
import watchUtils = require("esri/core/watchUtils");

import WCSLayer = require("./WCSLayer");

const topoGraatoneWmts = new WMTSLayer({
  url: "https://opencache.statkart.no/gatekeeper/gk/gk.open_wmts",
  serviceMode: "KVP",
  copyright: "Kartverket",
  activeLayer: {
    id: "topo4graatone"
  },
  fullExtent: {
    xmin: -2500000,
    ymin: 3499999.999999999,
    xmax: 3045984.000000001,
    ymax: 9045984,
    spatialReference: {
      wkid: 25833
    }
  }
});

const basemap = new Basemap({
  baseLayers: [topoGraatoneWmts],
  title: "Topo Gråtone",
  id: "topo4graatone"
});

debugger;
const map = new EsriMap({
  basemap: basemap,
  ground: {
    layers: [
      new WCSLayer({
        id: "custom-wcs-elevation-layer-id",
        title: "custom-wcs-elevation-layer",
        spatialReference: { wkid: 25833 }
      })
    ]
  }
});

const view = new SceneView({
  map: map,
  container: "viewDiv",
  viewingMode: "local",
  spatialReference: { wkid: 25833 },
  extent: {
    xmin: 213029.39990352467,
    ymin: 6638602.914498553,
    xmax: 309501.89990352467,
    ymax: 6672706.789498553,
    spatialReference: { wkid: 25833 }
  }
});

const displayWidget = getWcsDisplayWidget();
const imgNode = displayWidget.firstChild as HTMLImageElement;
view.ui.add(displayWidget, "bottom-right");

function getWcsDisplayWidget() {
  const container = document.createElement("div");
  container.className = "esri-widget";
  container.style.cssText = "padding: 0.2rem; background: #fff";

  const img = document.createElement("img");
  img.src = "https://via.placeholder.com/256";

  container.appendChild(img);

  return container;
}

// watchUtils.whenTrue(view, "stationary", () => {
//   const extent = view.extent;

//   const { xmin, ymin, xmax, ymax } = extent;
//   const heightToWidthRatio = extent.height / extent.width;

//   const imageWidth = 256;
//   const imageHeight = 256 * heightToWidthRatio;

//   const url = `https://wms.geonorge.no/skwms1/wcs.dtm?SERVICE=WCS&VERSION=1.0.0&REQUEST=GetCoverage&FORMAT=xyz&WIDTH=${Math.floor(
//     imageWidth
//   )}&HEIGHT=${Math.floor(
//     imageHeight
//   )}&COVERAGE=land_utm33_10m&crs=EPSG:25833&BBOX=${xmin},${ymin},${xmax},${ymax}`;

//   WCSLayer(url)
//     .then(image => {
//       imgNode.src = image;
//     })
//     .catch(error => {
//       console.warn("WCS ERROR");
//     });
// });

// WCSLayer(
//   "https://wms.geonorge.no/skwms1/wcs.dtm?SERVICE=WCS&VERSION=1.0.0&REQUEST=GetCoverage&FORMAT=geotiff&WIDTH=256&HEIGHT=256&COVERAGE=land_utm33_10m&crs=EPSG:25833&BBOX=213029,6638602,309501,6735074"
// )
//   .then(image => {
//     debugger;
//     imgNode.src = image;
//   })
//   .catch(err => {
//     debugger;
//   });
