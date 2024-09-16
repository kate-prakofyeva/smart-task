import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { User } from '../../types/User';
import { FiltersName } from '../../types/FiltersName';
import { Status } from '../../types/Status';

interface UsersState {
  users: User[];
  status: Status;
  error: string | null;
  filters: FiltersName;
}

const initialState: UsersState = {
  users: [],
  status: Status.Loading,
  error: null,
  filters: {
    name: '',
    username: '',
    email: '',
    phone: '',
  },
};

const API_URL = 'https://jsonplaceholder.typicode.com/users';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await axios.get(API_URL);
  return response.data as User[];
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = Status.Succeeded;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = Status.Failed;
        state.error = action.error.message || 'Failed to fetch users';
      });
  },
});

export const { setFilter, resetFilters } = usersSlice.actions;

export default usersSlice.reducer;
