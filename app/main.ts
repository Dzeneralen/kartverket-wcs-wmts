import EsriMap = require("esri/Map");
import Basemap = require("esri/Basemap");
import Ground = require("esri/Ground");
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

const customWcsElevationLayer = new WCSLayer({
  id: "custom-wcs-elevation-layer-id",
  title: "custom-wcs-elevation-layer"
});

const customGroundLayer = new Ground({
  layers: [customWcsElevationLayer]
});

const map = new EsriMap({
  basemap: basemap,
  ground: customGroundLayer
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
