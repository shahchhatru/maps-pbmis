import React, { useState, useEffect } from "react";
import { useGlobalState } from "../service/Store";

// Dummy data for the project dropdown
const dummyProjects = [
  { id: "proj_1", name: "Project Alpha" },
  { id: "proj_2", name: "Project Beta" },
  { id: "proj_3", name: "Project Gamma" },
];

const SaveModal = () => {
  // Global state for modal visibility and GeoJSON data
  const [isModalOpen, setIsModalOpen] = useGlobalState("isModalOpen");
  const [newShapeGeoJSON, setNewShapeGeoJSON] = useGlobalState("newShapeGeoJSON");
  const [layers, setLayers] = useGlobalState("layers");

  // Local state for form fields
  const [name, setName] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(dummyProjects[0]?.id || "");

  // Effect to reset form when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setName("");
      setSelectedProjectId(dummyProjects[0]?.id || 0);
    }
  }, [isModalOpen]);

  // Function to handle the API request
  const saveMapInfo = async () => {
    if (!name.trim()) {
      alert("Please enter a name for the shape.");
      return;
    }

    // Construct the payload to send to the backend
    const payload = {
      project_id: selectedProjectId,
      name: name,
      mapsymbol: newShapeGeoJSON?.geometry?.type || 'Polygon', // e.g., 'Polygon' or 'Point'
      coordinates: newShapeGeoJSON || [],
    };

    console.log("Sending data to backend:", payload);

    try {
      // Replace with your actual backend URL
      const dummyUrl = "https://your-backend.com/api/save-mapinfo";
      const response = await fetch(dummyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // Mocking a failed response for demonstration
        throw new Error("Network response was not ok.");
      }
      
      // Since the URL is a dummy, we'll simulate a success response
      console.log("Simulated API Response: { success: true, data: ... }");
      alert("Shape information saved successfully!");

      // Add the new shape to the map layers state and close the modal
      // Note: We use a simple unique ID here. In a real app, you might get an ID from the backend.
      const newLayer = { id: Date.now(), geojson: newShapeGeoJSON };
      setLayers(prev => [...prev, newLayer]);
      closeModal();

    } catch (error) {
      console.error("Failed to save map info:", error);
      alert("Failed to save shape. See console for details.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewShapeGeoJSON(null); // Clear the temp shape data
  };

  // Don't render the modal if it's not open
  if (!isModalOpen || !newShapeGeoJSON) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Save Shape Information</h2>

        <div className="form-group">
          <label htmlFor="shape-name">Name</label>
          <input
            id="shape-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter a name for the shape"
          />
        </div>

        <div className="form-group">
          <label htmlFor="project-select">Project</label>
          <select
            id="project-select"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            {dummyProjects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name} (ID: {project.id})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>GeoJSON Coordinates</label>
          <span className="geojson-display">
            <pre>{JSON.stringify(newShapeGeoJSON.geometry.coordinates, null, 2)}</pre>
          </span>
        </div>

        <div className="modal-actions">
          <button onClick={saveMapInfo} className="button-primary">Save</button>
          <button onClick={closeModal} className="button-secondary">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default SaveModal;
