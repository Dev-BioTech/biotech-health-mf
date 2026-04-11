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

  const applyFilters = (rawData) => {
    return rawData.filter((record) => {
      // Search (animalName, veterinarian, diagnosis)
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchAnimal = (record.animalName || record.animal || "").toLowerCase().includes(searchLower);
        const matchVet = (record.veterinarian || "").toLowerCase().includes(searchLower);
        const matchDiag = (record.diagnosis || record.disease || "").toLowerCase().includes(searchLower);
        if (!matchAnimal && !matchVet && !matchDiag) return false;
      }

      // Date From
      if (filterDateFrom && record.date) {
        if (new Date(record.date) < new Date(filterDateFrom)) return false;
      }

      // Date To
      if (filterDateTo && record.date) {
        // Include exactly the "To" date by checking boundary
        const recordDateStr = new Date(record.date).toISOString().split("T")[0];
        if (recordDateStr > filterDateTo) return false;
      }

      return true;
    });
  };

  // Load records when filters change
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const farmId = authUtils.getSelectedFarmId();
        const rawData = await healthService.getHealthRecords({
          type: filterType,
          farmId,
        });

        const filteredData = applyFilters(rawData);

        setRecords(filteredData);
        setItems(filteredData); // Sync items
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
      const createdRecord = await healthService.createRecord(newRecord);
      
      // Optimistic update using whatever backend returns or what we sent
      const newEntry = createdRecord || { ...newRecord, id: Date.now() };
      setRecords((prev) => [newEntry, ...prev]);
      setItems((prev) => [newEntry, ...prev]);
      
      // Defer full re-fetch to allow CQRS/Read-Model to catch up
      setTimeout(async () => {
        const farmId = authUtils.getSelectedFarmId();
        const rawData = await healthService.getHealthRecords({
          type: filterType,
          farmId,
        });
        const filteredData = applyFilters(rawData);
        setRecords(filteredData);
        setItems(filteredData);
      }, 500);
      
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
      const returnedRecord = await healthService.updateRecord(id, updatedRecord);
      
      // Optimistic update of local state immediately
      setRecords((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updatedRecord, ...returnedRecord } : r))
      );
      setItems((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updatedRecord, ...returnedRecord } : r))
      );

      // Defer full re-fetch to allow fast backend buses/caches to sync
      setTimeout(async () => {
        const farmId = authUtils.getSelectedFarmId();
        const rawData = await healthService.getHealthRecords({
          type: filterType,
          farmId,
        });
        const filteredData = applyFilters(rawData);
        setRecords(filteredData);
        setItems(filteredData);
      }, 500);

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
