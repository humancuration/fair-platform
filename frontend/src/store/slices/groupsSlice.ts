import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Group {
  id: number;
  name: string;
  type: string;
  description: string;
  createdBy: number;
  motto?: string;
  vision?: string;
  profilePicture?: string;
  coverPhoto?: string;
  pinnedAnnouncement?: string;
  location?: string;
  tags?: string[];
  resourceCredits: number;
}

interface GroupsState {
  groups: Group[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: GroupsState = {
  groups: [],
  status: 'idle',
  error: null,
};

export const fetchGroups = createAsyncThunk('groups/fetchGroups', async () => {
  const response = await axios.get('/api/groups');
  return response.data as Group[];
});

export const createGroup = createAsyncThunk('groups/createGroup', async (newGroup: Partial<Group>) => {
  const response = await axios.post('/api/groups', newGroup);
  return response.data as Group;
});

export const updateGroupProfile = createAsyncThunk(
  'groups/updateGroupProfile',
  async ({ id, profileData }: { id: number; profileData: Partial<Group> }) => {
    const response = await axios.patch(`/api/groups/${id}/profile`, profileData);
    return response.data as Group;
  }
);

export const searchGroups = createAsyncThunk(
  'groups/searchGroups',
  async (searchParams: any) => {
    const response = await axios.get('/api/groups/search', { params: searchParams });
    return response.data as Group[];
  }
);

export const fetchGroupById = createAsyncThunk(
  'groups/fetchGroupById',
  async (id: number) => {
    const response = await axios.get(`/api/groups/${id}`);
    return response.data as Group;
  }
);

export const offerResource = createAsyncThunk(
  'groups/offerResource',
  async ({ groupId, resourceData }: { groupId: number; resourceData: Partial<Resource> }) => {
    const response = await axios.post(`/api/groups/${groupId}/resources`, resourceData);
    return response.data as Resource;
  }
);

export const fetchResources = createAsyncThunk(
  'groups/fetchResources',
  async (groupId: number) => {
    const response = await axios.get(`/api/groups/${groupId}/resources`);
    return response.data as Resource[];
  }
);

export const castVote = createAsyncThunk(
  'groups/castVote',
  async ({ groupId, petitionId, voteType }: { groupId: number; petitionId: number; voteType: 'Upvote' | 'Downvote' }) => {
    const response = await axios.post(`/api/groups/${groupId}/petitions/${petitionId}/votes`, { voteType });
    return response.data as Vote;
  }
);

// ... additional async thunks ...

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroups.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.groups = action.payload;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch groups';
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.groups.push(action.payload);
      })
      .addCase(updateGroupProfile.fulfilled, (state, action) => {
        const index = state.groups.findIndex(group => group.id === action.payload.id);
        if (index !== -1) {
          state.groups[index] = action.payload;
        }
      })
      .addCase(searchGroups.fulfilled, (state, action) => {
        state.groups = action.payload;
      })
      .addCase(fetchGroupById.fulfilled, (state, action) => {
        const index = state.groups.findIndex(group => group.id === action.payload.id);
        if (index === -1) {
          state.groups.push(action.payload);
        } else {
          state.groups[index] = action.payload;
        }
      })
      .addCase(offerResource.fulfilled, (state, action) => {
        const group = state.groups.find(g => g.id === action.meta.arg.groupId);
        if (group) {
          group.resources = [...(group.resources || []), action.payload];
        }
      })
      .addCase(fetchResources.fulfilled, (state, action) => {
        const group = state.groups.find(g => g.id === action.meta.arg);
        if (group) {
          group.resources = action.payload;
        }
      })
      .addCase(castVote.fulfilled, (state, action) => {
        // Update vote counts or statuses as needed
      });
      // ... handle other cases ...
  },
});

export default groupsSlice.reducer;