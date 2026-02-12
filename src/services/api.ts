import axios from "axios";

/**
 * Axios instance
 * Тук можем да сложим baseURL, interceptors и др.
 */
const api = axios.create({
  baseURL: "/api",
});

/**
 * Upload CSV file
 */
export const uploadCsv = async (file: File) => {
  const formData = new FormData();
  formData.append("csvFile", file);

  const response = await api.post("/import-csv", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

/**
 * Execute SQL query
 */
export const executeSql = async (query: string) => {
  const response = await api.post("/execute-sql", {
    query,
  });

  return response.data;
};

/**
 * Export CSV
 */
export const exportCsv = async (tableName: string) => {
  const response = await api.post(
    "/export-csv",
    { tableName },
    { responseType: "blob" } // важно за файл
  );

  return response.data;
};
