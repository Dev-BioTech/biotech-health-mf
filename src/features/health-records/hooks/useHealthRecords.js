import { useState, useEffect } from "react";
import { healthService } from "../../../shared/services/healthService";
import { authUtils } from "../../../shared/utils/auth";

export const useHealthRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]); // Provide items alias for compatibility if needed

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Load records when filters change
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const farmId = authUtils.getSelectedFarmId();
        const data = await healthService.getHealthRecords({
          search: searchTerm,
          type: filterType,
          farmId,
        });
        setRecords(data);
        setItems(data); // Sync items
        setError(null);
      } catch (err) {
        console.error("Error fetching records:", err);
        setError("Error al cargar listado de salud");
      } finally {
        setLoading(false);
      }
    };

    // Debounce for search
    const timeoutId = setTimeout(() => {
      fetchRecords();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterType]);

  const createRecord = async (newRecord) => {
    try {
      setLoading(true);
      await healthService.createRecord(newRecord);
      // Reload to get the updated list
      const data = await healthService.getHealthRecords({
        search: searchTerm,
        type: filterType,
      });
      setRecords(data);
      setItems(data);
      return true;
    } catch (err) {
      setError("Error al crear registro");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    records,
    items, // For list view
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    createRecord,
  };
};
