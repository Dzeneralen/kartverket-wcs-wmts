# Kartverket WCS WMTS

## Content

This repository contains code for creating a custom ElevationLayer for use within the ArcGIS JS API 4.X from a Web Coverage Service (WCS) providing a Digital Terrain Model (DTM).

## Warning

The custom elevation layer based of WCS services is **highly** experimental and intended for demonstration pursposes.

It is not optimized. Problems with parsing .geotiff led to using FORMAT=XYZ as a temporary solution, but this results in some responses with sizes up to 2-3 MB.

## Licensing information

Data in the application comes from Kartverket (Norwegian mapping authority) and is subject to their licenses (see https://kartverket.no/data/lisens/ for more information).
