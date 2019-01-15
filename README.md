# Kartverket WCS WMTS

## Content

This repository contains code for creating a custom ElevationLayer for use within the ArcGIS JS API 4.X from a Web Coverage Service (WCS) providing a Digital Terrain Model (DTM).

![Bird view image of Vestfjorddalen rendered in 3D](https://github.com/Dzeneralen/kartverket-wcs-wmts/blob/master/screenshot.png?raw=true "Image of Vestfjorddalen")


## Getting started

1. Install node.js
2. Run `npm install` with this folder as the current working directory
3. Run `npm start` for it to compile and start a web server
4. Go to http://localhost:8080 to access the demo

## Warning

The custom elevation layer based of WCS services is **highly** experimental and intended for demonstration pursposes.

It is not optimized. Problems with parsing .geotiff led to using FORMAT=XYZ as a temporary solution, but this results in some responses with sizes up to 2-3 MB.

## Licensing information

Data in the application comes from Kartverket (Norwegian mapping authority) and is subject to their licenses (see https://kartverket.no/data/lisens/ for more information).
