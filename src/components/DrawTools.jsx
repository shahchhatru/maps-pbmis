import React, { useRef } from "react";
import L from "leaflet";
import {
	Map,
	TileLayer,
	Marker,
	Popup,
	FeatureGroup
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { useGlobalState } from "../services/Store"; 

const DrawTools = React.forwardRef((props, ref) => {
	const [, setIsModalOpen] = useGlobalState("isModalOpen");
	const [, setNewShapeGeoJSON] = useGlobalState("newShapeGeoJSON");

	// Ref to FeatureGroup for layer manipulation
	const featureGroupRef = useRef(null);
	// Keep track of last created layer
	const lastCreatedLayerRef = useRef(null);

	// Expose removeLastCreatedLayer to parent via ref
	React.useImperativeHandle(ref, () => ({
		removeLastCreatedLayer() {
			if (featureGroupRef.current && lastCreatedLayerRef.current) {
				featureGroupRef.current.removeLayer(lastCreatedLayerRef.current);
				lastCreatedLayerRef.current = null;
				setNewShapeGeoJSON(null);
			}
		}
	}));

	const _onEdited = e => {
		let numEdited = 0;
		e.layers.eachLayer(layer => {
			numEdited += 1;
		});
		console.log(`_onEdited: edited ${numEdited} layers`, e);
	};

	const _onCreated = e => {
		const { layerType, layer } = e;

		let coordinates;

		if (layerType === "marker") {
			const latLng = layer.getLatLng();
			coordinates = [latLng.lat, latLng.lng];
		} else if (layerType === "polygon" || layerType === "rectangle") {
			coordinates = layer.getLatLngs()[0].map(latlng => [latlng.lat, latlng.lng]);
		} else if (layerType === "polyline") {
			coordinates = layer.getLatLngs().map(latlng => [latlng.lat, latlng.lng]);
		} else {
			coordinates = layer.getLatLngs ? layer.getLatLngs() : null;
		}

		console.log("Extracted Coordinates:", coordinates);

		// Save the layer reference so we can remove if needed
		lastCreatedLayerRef.current = layer;

		// Save GeoJSON and open modal
		setNewShapeGeoJSON(layer.toGeoJSON());
		setIsModalOpen(true);
	};

	const _onDeleted = e => {
		let numDeleted = 0;
		e.layers.eachLayer(layer => {
			numDeleted += 1;
		});
		console.log(`onDeleted: removed ${numDeleted} layers`, e);
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

	return (
		<FeatureGroup ref={featureGroupRef}>
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
					// circlemarker: false,
					// circle: false,
					// polygon: false
				}}
			/>
		</FeatureGroup>
	);
});

export default DrawTools;
