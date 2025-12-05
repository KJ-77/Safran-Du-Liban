import { useState } from "react";
import BASE_URL from "Utilities/BASE_URL";

const usePost = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postData = async (url, payload) => {
    setLoading(true);
    setError(null);
    try {
      // Get authentication token from localStorage
      const token = localStorage.getItem("token");

      // Prepare headers
      const headers = {
        "Content-Type": "application/json",
      };

      // Add authorization header if token exists
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${BASE_URL}${url}`, {
        method: "POST",
        headers,
        credentials: "include", // Include cookies if needed
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorResult = await response.json().catch(() => ({}));
        throw new Error(errorResult.message || "Network response was not ok");
      }
      const result = await response.json();
      setData(result);
      return result;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, postData };
};

export default usePost;
