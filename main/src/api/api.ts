// src/workflow/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const executePythonCode = async (code: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/execute`, { code });
    return response.data;
  } catch (error: any) {
    console.error('Execution error:', error);
    throw error.response?.data || { error: 'Unknown error occurred' };
  }
};
