import { useState, useMemo } from 'react';

const useFilterAndSort = (data = [], type = []) => {
    const [sortBy, setSortBy] = useState('id');
    const [search, setSearch] = useState({
        query: '',
        fieldNumber: 0,
    });

    const currentField = useMemo(() => type[search.fieldNumber], [type, search.fieldNumber]);

    const changeFiled = () => {
        setSearch(prev => ({ ...prev, fieldNumber: (prev.fieldNumber + 1) % type.length }))
    };
    // 🔹 פונקציית מיון טהורה (אפשר להפעיל ידנית)
    const sortData = (inputData) => {
        if (!inputData) return [];

        return [...inputData].sort((a, b) => {
            if (sortBy === 'id') return parseInt(a.id) - parseInt(b.id);
            return String(a[sortBy]).localeCompare(
                String(b[sortBy]),
                undefined,
                { numeric: true }
            );
        });
    };

    // פונקציית סינון
    const filterData = (data) => {
        if (!data) return [];
        if (!search.query) return data;
        return data.filter(item =>
            String(item[currentField] || "").toLowerCase().includes(search.query.toLowerCase())
        );
    };

    // 🔹 מיון אוטומטי – רק כש־sortBy משתנה
    const sortedData = useMemo(() => {
        let filtered = data;
        if (search.query) 
            filtered = filterData(data);
        return sortData(filtered);
    }, [data, sortBy, search.query, currentField]);

    return {
        search: { query: search.query, field: currentField, changeFiled: changeFiled }, 
        setSearch,
        sortBy, setSortBy,
        filterData,
        sortData,
        sortedData
    };
};

export default useFilterAndSort;