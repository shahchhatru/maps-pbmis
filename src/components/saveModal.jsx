import React, { useState, useEffect } from "react";
import { useGlobalState } from "../services/Store";
import { useProjectMapAPI } from "../hooks/useProjectMapApi";
import { useLocation } from "react-router-dom";

// Dummy fallback projects
const dummyProjects = [
  { project_id: "proj_1", project_name: "Project Alpha" },
  { project_id: "proj_2", project_name: "Project Beta" },
  { project_id: "proj_3", project_name: "Project Gamma" },
];

// Dummy map types
const dummyMapTypes = [
  { id: 1, name: "Hospital" },
  { id: 2, name: "River" },
  { id: 3, name: "School" },
  { id: 4, name: "Forest" },
  { id: 5, name: "Hill" },
  { id: 6, name: "Temple" },
  { id: 7, name: "Church" },
];

const SaveModal = () => {
  const [isModalOpen, setIsModalOpen] = useGlobalState("isModalOpen");
  const [newShapeGeoJSON, setNewShapeGeoJSON] = useGlobalState("newShapeGeoJSON");
  const [layers, setLayers] = useGlobalState("layers");

  const { fetchProjects, addMap, loading, error } = useProjectMapAPI();

  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedMapTypeId, setSelectedMapTypeId] = useState(dummyMapTypes[0].id);

const location = useLocation();
const queryParams = new URLSearchParams(location.search);
const queryProjectId = queryParams.get("project_id");
  // Fetch projects on modal open
  useEffect(() => {
    if (isModalOpen) {
      setName("");
        fetchProjects()
      .then(function (data) {
        let projectList = data && data.length > 0 ? data : dummyProjects;

        // ✅ If project_id is in query and not in fetched projects, add it
        if (queryProjectId && !projectList.some(p => p.project_id === queryProjectId)) {
          projectList = [
            { project_id: queryProjectId, project_name: queryProjectId },
            ...projectList,
          ];
        }

        setProjects(projectList);
        setSelectedProjectId(queryProjectId || projectList[0].project_id);
      })
      .catch(function (err) {
        console.error("Failed to fetch projects:", err);

        let projectList = dummyProjects;

        if (queryProjectId && !dummyProjects.some(p => p.project_id === queryProjectId)) {
          projectList = [
            { project_id: queryProjectId, project_name: queryProjectId },
            ...dummyProjects,
          ];
        }

        setProjects(projectList);
        setSelectedProjectId(queryProjectId || dummyProjects[0].project_id);
         });
    }
  }, [isModalOpen, fetchProjects, queryProjectId]);

  // Save map info
  const saveMapInfo = async () => {
    if (!name.trim()) {
      alert("Please enter a name for the shape.");
      return;
    }

    var mapSymbol = (newShapeGeoJSON && newShapeGeoJSON.geometry && newShapeGeoJSON.geometry.type) || "Polygon";

    var payload = {
      name: name,
      project_id: selectedProjectId,
      coordinates: newShapeGeoJSON || [],
      map_type_id: selectedMapTypeId,
    };

    try {
      const result = await addMap(payload);

      if (!result || !result.success) {
        throw new Error((result && result.message) || "Failed to add map");
      }

      alert("Shape information saved successfully!");

      const newLayer = { id: Date.now(), geojson: newShapeGeoJSON };
      setLayers(function(prev) { return prev.concat(newLayer); });
      closeModal();
    } catch (error) {
      console.error("Failed to save map info:", error);
      alert("Failed to save shape. See console for details.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewShapeGeoJSON(null);
  };

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
            onChange={function(e) { setName(e.target.value); }}
            placeholder="Enter a name for the shape"
          />
        </div>

        <div className="form-group">
          <label htmlFor="project-select">Project</label>
          <select
            id="project-select"
            value={selectedProjectId}
            onChange={function(e) { setSelectedProjectId(e.target.value); }}
          >
            {projects.map(function(project) {
              return (
                <option key={project.project_id} value={project.project_id}>
                  {project.project_name} (ID: {project.project_id})
                </option>
              );
            })}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="map-type-select">Map Type</label>
          <select
            id="map-type-select"
            value={selectedMapTypeId}
            onChange={function(e) { setSelectedMapTypeId(Number(e.target.value)); }}
          >
            {dummyMapTypes.map(function(type) {
              return (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              );
            })}
          </select>
        </div>

        <div className="form-group">
          <label>GeoJSON Coordinates</label>
          <span className="geojson-display">
            <pre>
              {newShapeGeoJSON &&
                newShapeGeoJSON.geometry &&
                JSON.stringify(newShapeGeoJSON.geometry.coordinates, null, 2)}
            </pre>
          </span>
        </div>

        <div className="modal-actions">
          <button onClick={saveMapInfo} className="button-primary" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
          <button onClick={closeModal} className="button-secondary">
            Cancel
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default SaveModal;
