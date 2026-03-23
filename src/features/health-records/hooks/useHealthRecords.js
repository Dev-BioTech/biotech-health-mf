import { useState, useEffect } from "react";
import { healthService } from "@shared/services/healthService";
import { authUtils } from "@shared/utils/auth";

export const useHealthRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]); // Provide items alias for compatibility if needed

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5);

  // Load records when filters change
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const farmId = authUtils.getSelectedFarmId();
        const data = await healthService.getHealthRecords({
          search: searchTerm,
          type: filterType,
          fromDate: filterDateFrom,
          toDate: filterDateTo,
          farmId,
        });
        setRecords(data);
        setItems(data); // Sync items
        setCurrentPage(1); // Reset to first page on new filter/search
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
  }, [searchTerm, filterType, filterDateFrom, filterDateTo]);

  // Derived pagination data
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(records.length / recordsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  const updateRecord = async (id, updatedRecord) => {
    try {
      setLoading(true);
      await healthService.updateRecord(id, updatedRecord);
      // Reload to get the updated list
      const data = await healthService.getHealthRecords({
        search: searchTerm,
        type: filterType,
        fromDate: filterDateFrom,
        toDate: filterDateTo,
        farmId: authUtils.getSelectedFarmId(),
      });
      setRecords(data);
      setItems(data);
      return true;
    } catch (err) {
      setError("Error al actualizar registro");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    records: currentRecords,
    allRecords: records,
    items: currentRecords,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filterDateFrom,
    setFilterDateFrom,
    filterDateTo,
    setFilterDateTo,
    createRecord,
    updateRecord,
    currentPage,
    totalPages,
    paginate,
  };
};
