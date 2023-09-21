// import MapboxDraw from "@mapbox/mapbox-gl-draw";
const distance = require("@turf/distance").default;
const circle = require("@turf/circle").default;

import { DirectMode } from "mapbox-gl-draw-circle";
import * as turfHelper from "@turf/helpers";

const DirectModeOverride = DirectMode;

DirectModeOverride.dragVertex = function(state, e, delta) {
  if (state.feature.properties.isRectangle) {
    if (state.selectedCoordPaths.length != 1) {
      return;
    }
    const vertex = state.selectedCoordPaths[0];

    switch (vertex) {
      case "0.0":
        this.calculateVertices(
          state,
          "0.0",
          "0.1",
          "0.2",
          "0.3",
          delta.lng,
          delta.lat
        );
        break;
      case "0.1":
        this.calculateVertices(
          state,
          "0.1",
          "0.2",
          "0.3",
          "0.0",
          delta.lng,
          delta.lat
        );
        break;
      case "0.2":
        this.calculateVertices(
          state,
          "0.2",
          "0.3",
          "0.0",
          "0.1",
          delta.lng,
          delta.lat
        );
        break;
      case "0.3":
        this.calculateVertices(
          state,
          "0.3",
          "0.0",
          "0.1",
          "0.2",
          delta.lng,
          delta.lat
        );
        break;
    }
  } else if (state.feature.properties.isCircle) {
    const center = state.feature.properties.center;
    const movedVertex = [e.lngLat.lng, e.lngLat.lat];
    console.log(movedVertex);
    const radius = distance(
      turfHelper.point(center),
      turfHelper.point(movedVertex),
      {
        units: "kilometers"
      }
    );
    const circleFeature = circle(center, radius);
    state.feature.incomingCoords(circleFeature.geometry.coordinates);
    state.feature.properties.radiusInKm = radius;
  } else {
    const selectedCoords = state.selectedCoordPaths.map(coord_path =>
      state.feature.getCoordinate(coord_path)
    );

    for (let i = 0; i < selectedCoords.length; i++) {
      const coord = selectedCoords[i];
      state.feature.updateCoordinate(
        state.selectedCoordPaths[i],
        coord[0] + delta.lng,
        coord[1] + delta.lat
      );
    }
  }
};

DirectModeOverride.calculateVertices = function(
  state,
  ndxC,
  ndxB,
  ndxA,
  ndxD,
  dx,
  dy
) {
  const C = state.feature.getCoordinate(ndxC);
  const B = state.feature.getCoordinate(ndxB);
  const A = state.feature.getCoordinate(ndxA);
  const D = state.feature.getCoordinate(ndxD);

  const xd = D[0];
  const yd = D[1];
  const xc = C[0];
  const yc = C[1];
  const xb = B[0];
  const yb = B[1];
  const xa = A[0];
  const ya = A[1];

  // dragged vertex
  state.feature.updateCoordinate(ndxC, xc + dx, yc + dy);

  if (xd - xa == 0) {
    state.feature.updateCoordinate(ndxD, xd, yd + dy);
    state.feature.updateCoordinate(ndxB, xb + dx, yb);
  } else if (xb - xa == 0) {
    state.feature.updateCoordinate(ndxD, xd + dx, yd);
    state.feature.updateCoordinate(ndxB, xb, yb + dy);
  } else {
    const rcab = (yb - ya) / (xb - xa);
    const rcad = (yd - ya) / (xd - xa);

    const nxd = ((-xc - dx) * rcab + yc + dy + xa * rcad - ya) / (rcad - rcab);
    const nyd = rcad * nxd + (-xa * rcad + ya);
    state.feature.updateCoordinate(ndxD, nxd, nyd);

    const nxb = ((-xc - dx) * rcad + yc + dy + xa * rcab - ya) / (rcab - rcad);
    const nyb = rcab * nxb + (-xa * rcab + ya);
    state.feature.updateCoordinate(ndxB, nxb, nyb);
  }
};

DirectModeOverride.onMidpoint = function(state, e) {
  console.log("DirectModeOverride.onMidpoint");
  if (state.feature.properties.isRectangle) {
    return;
  }
  this.startDragging(state, e);
  const about = e.featureTarget.properties;
  state.feature.addCoordinate(about.coord_path, about.lng, about.lat);
  this.fireUpdate();
  state.selectedCoordPaths = [about.coord_path];
};

export default DirectModeOverride;
