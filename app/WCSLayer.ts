// To make TypeScript stop infering and
// complaining about undeclared variable.
// Imported globally with a normal script tag
declare var TIFFParser: any;

import Deferred = require("dojo/Deferred");

import Extent = require("esri/geometry/Extent");
import SpatialReference = require("esri/geometry/SpatialReference");
import BaseElevationLayer = require("esri/layers/BaseElevationLayer");
import { Point } from "esri/geometry";

const getTile = (url: string) => {
  const deferred = new Deferred<string>();

  try {
    var xhrRequest = new XMLHttpRequest();

    xhrRequest.open("GET", url, true);
    xhrRequest.responseType = "text";

    xhrRequest.onreadystatechange = function() {
      if (xhrRequest.readyState === 4) {
        // request is done

        if (xhrRequest.status === 200) {
          //const tiffParser = new TIFFParser();

          //tiffParser.parseTIFF(xhrRequest.response);
          //const dataUrl = tiffParser.canvas.toDataURL();
          deferred.resolve(xhrRequest.response);
        } else {
          deferred.reject("Failed to get response from WCS");
        }
      }
    };

    xhrRequest.send();
  } catch (exception) {}

  return deferred.promise;
};

const WCSElevationLayer = BaseElevationLayer.createSubclass({
  // This function must associate elevation tiles with temperature
  // values. This is achieved by getting the bounds (or extent)
  // of the tile and fetching a temperature image based on
  // the returned extent

  load: function() {
    this.fullExtent = {
      xmin: -2500000,
      ymin: 3499999.999999999,
      xmax: 3045984.000000001,
      ymax: 9045984,
      spatialReference: {
        wkid: 25833
      }
    };
    this.tileInfo = {
      size: [256, 256],
      dpi: 96,
      format: "png",
      spatialReference: new SpatialReference({
        wkid: 25833
      }),
      origin: new Point({
        x: -2500000,
        y: 9045984,
        spatialReference: {
          wkid: 25833
        }
      }),
      lods: [
        {
          level: 0,
          levelValue: "EPSG:25833:0",
          resolution: 21664.000000000004,
          scale: 81879685.03937009
        },
        {
          level: 1,
          levelValue: "EPSG:25833:1",
          resolution: 10832.000000000002,
          scale: 40939842.519685045
        },
        {
          level: 2,
          levelValue: "EPSG:25833:2",
          resolution: 5416.000000000001,
          scale: 20469921.259842522
        },
        {
          level: 3,
          levelValue: "EPSG:25833:3",
          resolution: 2708.0000000000005,
          scale: 10234960.629921261
        },
        {
          level: 4,
          levelValue: "EPSG:25833:4",
          resolution: 1354.0000000000002,
          scale: 5117480.314960631
        },
        {
          level: 5,
          levelValue: "EPSG:25833:5",
          resolution: 677.0000000000001,
          scale: 2558740.1574803153
        },
        {
          level: 6,
          levelValue: "EPSG:25833:6",
          resolution: 338.50000000000006,
          scale: 1279370.0787401577
        },
        {
          level: 7,
          levelValue: "EPSG:25833:7",
          resolution: 169.25000000000003,
          scale: 639685.0393700788
        },
        {
          level: 8,
          levelValue: "EPSG:25833:8",
          resolution: 84.62500000000001,
          scale: 319842.5196850394
        },
        {
          level: 9,
          levelValue: "EPSG:25833:9",
          resolution: 42.31250000000001,
          scale: 159921.2598425197
        },
        {
          level: 10,
          levelValue: "EPSG:25833:10",
          resolution: 21.156250000000004,
          scale: 79960.62992125985
        },
        {
          level: 11,
          levelValue: "EPSG:25833:11",
          resolution: 10.578125000000002,
          scale: 39980.31496062993
        },
        {
          level: 12,
          levelValue: "EPSG:25833:12",
          resolution: 5.289062500000001,
          scale: 19990.157480314963
        },
        {
          level: 13,
          levelValue: "EPSG:25833:13",
          resolution: 2.6445312500000004,
          scale: 9995.078740157482
        },
        {
          level: 14,
          levelValue: "EPSG:25833:14",
          resolution: 1.3222656250000002,
          scale: 4997.539370078741
        },
        {
          level: 15,
          levelValue: "EPSG:25833:15",
          resolution: 0.6611328125000001,
          scale: 2498.7696850393704
        },
        {
          level: 16,
          levelValue: "EPSG:25833:16",
          resolution: 0.33056640625000006,
          scale: 1249.3848425196852
        },
        {
          level: 17,
          levelValue: "EPSG:25833:17",
          resolution: 0.16528320312500003,
          scale: 624.6924212598426
        },
        {
          level: 18,
          levelValue: "EPSG:25833:18",
          resolution: 0.08264160156250001,
          scale: 312.3462106299213
        }
      ]
    };
  },

  fetchTile: function(level: number, row: number, col: number) {
    const bounds = this.getTileBounds(level, row, col);
    const tileSize: number = this.tileInfo.size[0] + 1;
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

    const noDataValue = 1000;

    return getTile(url).then(
      response => {
        const xyzArray = response.replace(/nan/g, "0").split("\n");

        const exaggeration = 2;
        const heightValues = xyzArray.map(
          xyzSpaceDelimited => +xyzSpaceDelimited.split(" ")[2] * exaggeration
        );

        let dummyValues = new Array(tileSize * tileSize).map(val => 0);

        return {
          values: heightValues,
          width: tileSize, // pixelBlock.width,
          height: tileSize, //pixelBlock.height,
          noDataValue: noDataValue
        };
      },
      error => {
        console.warn("WCS failed me :(");
      }
    );

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
