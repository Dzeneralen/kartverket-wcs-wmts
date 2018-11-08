import EsriMap = require("esri/Map");
import Basemap = require("esri/Basemap");
import WMTSLayer = require("esri/layers/WMTSLayer");
import SceneView = require("esri/views/SceneView");

import WCSLayer = require("./WCSLayer");

const topoGraatoneWmts = new WMTSLayer({
  url: "https://opencache.statkart.no/gatekeeper/gk/gk.open_wmts",
  serviceMode: "KVP",
  copyright: "Kartverket",
  activeLayer: {
    id: "topo4graatone"
  }
});

const basemap = new Basemap({
  baseLayers: [topoGraatoneWmts],
  title: "Topo Gråtone",
  id: "topo4graatone"
});

const map = new EsriMap({
  basemap: basemap
});

const view = new SceneView({
  map: map,
  container: "viewDiv",
  spatialReference: { wkid: 25833 },
  extent: {
    xmin: 213029.39990352467,
    ymin: 6638602.914498553,
    xmax: 309501.89990352467,
    ymax: 6672706.789498553,
    spatialReference: { wkid: 25833 }
  }
});
