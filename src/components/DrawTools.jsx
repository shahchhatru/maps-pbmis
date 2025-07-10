import React, { useState } from "react";
import L from "leaflet";
import {
	Map,
	TileLayer,
	Marker,
	Popup,
	FeatureGroup,
	Circle
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { useGlobalState } from "../services/Store"; 

const DrawTools = () => {
	 const [, setIsModalOpen] = useGlobalState("isModalOpen");
    const [, setNewShapeGeoJSON] = useGlobalState("newShapeGeoJSON");

	const _onEdited = e => {
		let numEdited = 0;
		e.layers.eachLayer(layer => {
			numEdited += 1;
		});
		console.log(`_onEdited: edited ${numEdited} layers`, e);

		// this._onChange();
	};

	const _onCreated = e => {
		// let type = e.layerType;
		// let layer = e.layer;
		// if (type === "marker") {
		// 	// Do marker specific actions
		// 	console.log("_onCreated: marker created", e);
		// } else {
		// 	console.log("_onCreated: something else created:", type, e);
		// }

		// console.log("Geohttp://localhost:3000/json", layer.toGeoJSON());
		// console.log("coords", layer.getLatLngs());
		// Do whatever else you need to. (save to db; etc)
		// console.log(" co ordinates", JSON.stringify(e.layer.toGeoJSON()));
		// console.log(" co ordinates", JSON.stringify(e));
		const { layerType, layer } = e;

    // Use the layer's getLatLngs() method to get the coordinates
    const latLngs = layer.getLatLngs();

    // The structure of latLngs differs. Polygons are nested one level deeper.
    // We'll map the LatLng objects to a clean [latitude, longitude] array.
    let coordinates;

    if (layerType === "polygon" || layerType === "rectangle") {
        // For polygons, the coordinates are in the first element of the array.
        // We map over them to create a simple array of [lat, lng] pairs.
        coordinates = latLngs[0].map(latlng => [latlng.lat, latlng.lng]);
    } else { // This handles polylines
        coordinates = latLngs.map(latlng => [latlng.lat, latlng.lng]);
    }

    // ✅ This will log only the clean coordinates array
    console.log("Extracted Coordinates:", coordinates);

    // You can still proceed with saving the full GeoJSON to the state
    const newLayer = { id: layer._leaflet_id, geojson: layer.toGeoJSON() };

	  setNewShapeGeoJSON(layer.toGeoJSON());
        
        // Open the modal
    setIsModalOpen(true);
		// this._onChange();
	};

	const _onDeleted = e => {
		let numDeleted = 0;
		e.layers.eachLayer(layer => {
			numDeleted += 1;
		});
		console.log(`onDeleted: removed ${numDeleted} layers`, e);

		// this._onChange();
	};

	const _onMounted = drawControl => {
		console.log("_onMounted", drawControl);
	};

	const _onEditStart = e => {
		console.log("_onEditStart", e);
	};

	const _onEditStop = e => {
		console.log("_onEditStop", e);
	};

	const _onDeleteStart = e => {
		console.log("_onDeleteStart", e);
	};

	const _onDeleteStop = e => {
		console.log("_onDeleteStop", e);
	};

	const _onDrawStart = e => {
		console.log("_onDrawStart", e);
	};

	/*onEdited	function	hook to leaflet-draw's draw:edited event
onCreated	function	hook to leaflet-draw's draw:created event
onDeleted	function	hook to leaflet-draw's draw:deleted event
onMounted	function	hook to leaflet-draw's draw:mounted event
onEditStart	function	hook to leaflet-draw's draw:editstart event
onEditStop	function	hook to leaflet-draw's draw:editstop event
onDeleteStart	function	hook to leaflet-draw's draw:deletestart event
onDeleteStop	function	hook to leaflet-draw's draw:deletestop event
onDrawStart	function	hook to leaflet-draw's draw:drawstart event
onDrawStop	function	hook to leaflet-draw's draw:drawstop event
onDrawVertex	function	hook to leaflet-draw's draw:drawvertex event
onEditMove	function	hook to leaflet-draw's draw:editmove event
onEditResize	function	hook to leaflet-draw's draw:editresize event
onEditVertex	function	hook to leaflet-draw's draw:editvertex event*/
	return (
		<FeatureGroup>
			<EditControl
				onDrawStart={_onDrawStart}
				position="topleft"
				onEdited={_onEdited}
				onCreated={_onCreated}
				onDeleted={_onDeleted}
				draw={{
					polyline: {
						icon: new L.DivIcon({
							iconSize: new L.Point(8, 8),
							className: "leaflet-div-icon leaflet-editing-icon"
						}),
						shapeOptions: {
							guidelineDistance: 10,
							color: "navy",
							weight: 3
						}
					},
					rectangle: false,
					circlemarker: false,
					circle: false,
					polygon: false
				}}
			/>
		</FeatureGroup>
	);
};

export default DrawTools;
