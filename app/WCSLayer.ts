// To make TypeScript stop infering and
// complaining about undeclared variable.
// Imported globally with a normal script tag
declare var TIFFParser: any;

import Extent = require("esri/geometry/Extent");
import BaseElevationLayer = require("esri/layers/BaseElevationLayer");

const getTile = (url: string) => {
  const promise = new Promise<string>((resolve, reject) => {
    var xhrRequest = new XMLHttpRequest();

    xhrRequest.open("GET", url, true);
    xhrRequest.responseType = "arraybuffer";

    xhrRequest.onreadystatechange = function() {
      if (xhrRequest.readyState === 4) {
        // request is done

        if (xhrRequest.status === 200) {
          const tiffParser = new TIFFParser();

          tiffParser.parseTIFF(xhrRequest.response);
          const dataUrl = tiffParser.canvas.toDataURL();

          resolve(dataUrl);
        } else {
          reject("Failed to get response from WCS");
        }
      }
    };

    xhrRequest.send();
  });

  return promise;
};

const WCSElevationLayer = BaseElevationLayer.createSubclass({
  // This function must associate elevation tiles with temperature
  // values. This is achieved by getting the bounds (or extent)
  // of the tile and fetching a temperature image based on
  // the returned extent

  load: function() {
    debugger;
    return this;
  },

  fetchTile: function(level: number, row: number, col: number) {
    debugger;
    var bounds = this.getTileBounds(level, row, col);
    var tileSize = this.tileInfo.size[0] + 1;
    var extent = new Extent({
      xmin: bounds[0],
      ymin: bounds[1],
      xmax: bounds[2],
      ymax: bounds[3],
      spatialReference: this.spatialReference
    });

    const { xmin, ymin, xmax, ymax } = extent;

    const format = "xyz";
    const url = `https://wms.geonorge.no/skwms1/wcs.dtm?SERVICE=WCS&VERSION=1.0.0&REQUEST=GetCoverage&FORMAT=${format}&WIDTH=${tileSize}&HEIGHT=${tileSize}&COVERAGE=land_utm33_10m&crs=EPSG:25833&BBOX=${xmin},${ymin},${xmax},${ymax}`;

    const noDataValue = 0;

    return getTile(url)
      .then(response => {
        const xyzArray = response.split("\n");

        return {
          values: new Array(256 * 256),
          width: tileSize, // pixelBlock.width,
          height: tileSize, //pixelBlock.height,
          noDataValue: noDataValue
        };
      })
      .catch(error => {
        console.warn("WCS failed me :(");
        return {
          values: new Array(256 * 256),
          width: tileSize, // pixelBlock.width,
          height: tileSize, //pixelBlock.height,
          noDataValue: noDataValue
        };
      });

    // fetch the image representing temperature for the extent of the tile.
    // this method returns the pixel data of the image for the extent
    // of the given elevation tile
    // return this._temperature.fetchImage(extent, tileSize, tileSize).then(
    //   function(data: any) {
    //     var pixelBlock = data.pixelData.pixelBlock;
    //     // contains the temperature values of each pixel in the image
    //     var elevations = pixelBlock.pixels[0];
    //     var stats = pixelBlock.statistics[0];
    //     // pixels that don't contain any temperature values
    //     var noDataValue = stats.noDataValue;

    //     elevations.forEach(function(value: any, index: any, pixelData: any) {
    //       if (value !== noDataValue) {
    //         // multiply temperatures by the given factor
    //         pixelData[index] = value * factor;
    //       } else {
    //         // areas with no temperature data (land)
    //         // will be assigned the average sea surface
    //         // temperature (17 degrees Celsius)
    //         pixelData[index] = 17 * factor;
    //       }
    //     });

    //     // return the modified temperatures as elevations
    //     return {
    //       values: elevations,
    //       width: pixelBlock.width,
    //       height: pixelBlock.height,
    //       noDataValue: noDataValue
    //     };
    //   }.bind(this)
    // );
  }
});

export = WCSElevationLayer;
