import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {baseInstance} from '../api/axios';
import {requests} from '../api/requests';

interface PathProps {
  latitude: number;
  longitude: number;
}

interface GuidesProps {
  senderEmail: string;
  receiverEmail: string;
  path: PathProps[];
}

const initialState: GuidesProps = {
  senderEmail: '',
  receiverEmail: '',
  path: [{latitude: 0, longitude: 0}],
};

export const guidesPost = createAsyncThunk(
  'guides/post',
  async (data: GuidesProps) => {
    const response = await baseInstance.post(requests.POST_GUIDES(), data);
    return response.data;
  },
);

const guidesSlice = createSlice({
  name: 'guides',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(guidesPost.pending, state => {
      console.log('pending');
    });
    builder.addCase(guidesPost.fulfilled, (state, action) => {
      console.log('fulfilled');
    });
    builder.addCase(guidesPost.rejected, (state, action) => {
      console.log('reject', action.error);
    });
  },
});

export default guidesSlice.reducer;
