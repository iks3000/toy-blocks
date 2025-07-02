// Utility for handling API requests with CORS error handling
export const apiRequest = async (url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${url}:`, error);

    // Handle CORS errors specifically
    if (
      error instanceof TypeError &&
      error.message.includes("Failed to fetch")
    ) {
      throw new Error(
        `CORS error: Unable to access ${url}. The server may not allow requests from this origin.`
      );
    }

    throw error;
  }
};

// Check if URL is accessible (for status checking)
export const checkUrlAccessibility = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      mode: "no-cors", // This will not throw CORS errors but also won't give us response details
    });
    return true;
  } catch (error) {
    return false;
  }
};
