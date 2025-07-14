import { useState, useCallback } from 'react';
import { BASE_URL } from '../constants';
export const useProjectMapAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Fetch list of projects
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(BASE_URL+'projectIdAndName');
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch projects');
      }

      return result.data; // Array of { project_name, project_id }
    } catch (err) {
      console.error('fetchProjects error:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Fetch map types
  const fetchMapTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(BASE_URL+ 'mapTypes');
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch map types');
      }

      return result.data; // Array of { id, name, imageLink }
    } catch (err) {
      console.error('fetchMapTypes error:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Add a new map
  const addMap = useCallback(async ({ name, project_id, coordinates, map_type_id }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(BASE_URL+ 'addMap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          project_id,
          coordinates,
          map_type_id,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to add map');
      }

      return result; // { success, message, data (if any) }
    } catch (err) {
      console.error('addMap error:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchProjects,
    fetchMapTypes,
    addMap,
  };
};
