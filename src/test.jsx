import React, { useRef, useEffect } from "react";
import { Map, TileLayer, FeatureGroup } from "react-leaflet";
import L from "leaflet";
import { EditControl } from "react-leaflet-draw";
import { useGlobalState } from "./services/Store"; // Adjust the import path as necessary

// --- Workaround for broken icons when using webpack ---
// This part remains the same.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-shadow.png",
});
// --- End Workaround ---

const Test = (props) => {
  // --- State Management with Hooks ---
  // We can now use hooks at the top level of our functional component.
  const [, setIsModalOpen] = useGlobalState("isModalOpen");
  const [, setNewShapeGeoJSON] = useGlobalState("newShapeGeoJSON");

  // --- Refs with Hooks ---
  // Use the useRef hook to get a reference to the FeatureGroup
  const editableFgRef = useRef(null);

  // --- Event Handlers ---
  // These are now regular functions within our component.
  const _onCreated = (e) => {
    const { layer } = e;
    
    // Set the GeoJSON of the new shape into our global state
    setNewShapeGeoJSON(layer.toGeoJSON());
    
    // Open the modal
    setIsModalOpen(true);
  };

  const _onChange = () => {
    // Access the ref's current value to get the Leaflet element
    if (!editableFgRef.current || !props.onChange) {
      return;
    }
    const geojsonData = editableFgRef.current.leafletElement.toGeoJSON();
    props.onChange(geojsonData);
  };

  const _onEdited = (e) => {
    console.log(`Edited ${Object.keys(e.layers).length} layers`, e);
    _onChange();
  };

  const _onDeleted = (e) => {
    console.log(`Deleted ${Object.keys(e.layers).length} layers`, e);
    _onChange();
  };

  // --- Lifecycle with Hooks ---
  // useEffect replaces componentDidMount and other lifecycle methods.
  // This effect runs once when the component mounts.
  useEffect(() => {
    if (!editableFgRef.current) {
        return;
    }
    // Load initial GeoJSON data into the FeatureGroup
    const leafletGeoJSON = new L.GeoJSON(getGeoJson());
    const leafletFG = editableFgRef.current.leafletElement;

    leafletGeoJSON.eachLayer(layer => {
      leafletFG.addLayer(layer);
    });
  }, []);


  return (
    <Map center={[37.8189, -122.4786]} zoom={13} zoomControl={false}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
      />
      <FeatureGroup ref={editableFgRef}>
        <EditControl
          position="topright"
          onCreated={_onCreated}
          onEdited={_onEdited}
          onDeleted={_onDeleted}
          draw={{
            rectangle: false,
          }}
        />
      </FeatureGroup>
    </Map>
  );
};

// Data function remains the same
function getGeoJson() {
  return {
    type: "FeatureCollection",
    features: [
      // ... your GeoJSON features are unchanged
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-122.48069286346434, 37.800637436707525],
              [-122.48069286346434, 37.803104310307276],
              [-122.47950196266174, 37.803104310307276],
              [-122.47950196266174, 37.800637436707525],
              [-122.48069286346434, 37.800637436707525]
            ]
          ]
        }
      },
    ]
  };
}

export default Test;
