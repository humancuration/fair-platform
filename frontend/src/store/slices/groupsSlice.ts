import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';

export interface Group {
  id: string;
  name: string;
  description: string;
  members: string[];
  admins: string[];
  createdAt: string;
  updatedAt: string;
  avatar?: string;
  banner?: string;
  isPublic: boolean;
  tags: string[];
  memberCount: number;
}

interface GroupsState {
  selectedGroupId: string | null;
  viewMode: 'grid' | 'list';
  filters: {
    searchQuery: string;
    tag: string | null;
    membershipStatus: 'all' | 'member' | 'admin' | 'none';
  };
}

// React Query hooks
export const useGroups = (filters?: Partial<GroupsState['filters']>) => {
  return useQuery({
    queryKey: ['groups', filters],
    queryFn: async () => {
      const { data } = await axios.get('/api/groups', { params: filters });
      return data as Group[];
    }
  });
};

export const useGroupDetails = (groupId: string) => {
  return useQuery({
    queryKey: ['group', groupId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/groups/${groupId}`);
      return data as Group;
    },
    enabled: !!groupId
  });
};

export const useCreateGroupMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (groupData: Partial<Group>) => {
      const { data } = await axios.post('/api/groups', groupData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    }
  });
};

export const useJoinGroupMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (groupId: string) => {
      const { data } = await axios.post(`/api/groups/${groupId}/join`);
      return data;
    },
    onSuccess: (_, groupId) => {
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    }
  });
};

// Redux slice for UI state
const groupsSlice = createSlice({
  name: 'groups',
  initialState: {
    selectedGroupId: null,
    viewMode: 'grid',
    filters: {
      searchQuery: '',
      tag: null,
      membershipStatus: 'all',
    },
  } as GroupsState,
  reducers: {
    setSelectedGroup: (state, action: PayloadAction<string | null>) => {
      state.selectedGroupId = action.payload;
    },
    setViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.viewMode = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<GroupsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        searchQuery: '',
        tag: null,
        membershipStatus: 'all',
      };
    },
  },
});

export const {
  setSelectedGroup,
  setViewMode,
  setFilters,
  resetFilters,
} = groupsSlice.actions;

export default groupsSlice.reducer;

// Framer Motion animations
export const groupCardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  hover: {
    scale: 1.03,
    transition: { duration: 0.2 }
  }
};

export const GroupCardAnimation = motion.div;
