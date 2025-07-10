import React from "react";
import { createGlobalState } from "react-hooks-global-state";

const initialState = { editLayers: [] ,  isModalOpen: false,
  // To temporarily store the GeoJSON of the shape being created
  newShapeGeoJSON: null,};
const { GlobalStateProvider, useGlobalState } = createGlobalState(initialState);

export { GlobalStateProvider, useGlobalState };
