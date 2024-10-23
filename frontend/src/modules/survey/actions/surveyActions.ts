import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createSurvey = createAsyncThunk(
  'survey/create',
  async (surveyData: any) => {
    const response = await axios.post('/api/surveys', surveyData);
    return response.data;
  }
);

export const updateSurvey = createAsyncThunk(
  'survey/update',
  async (surveyData: any) => {
    const response = await axios.put(`/api/surveys/${surveyData.id}`, surveyData);
    return response.data;
  }
);
