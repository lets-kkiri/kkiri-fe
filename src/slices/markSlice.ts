import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {naverInstance} from '../api/axios';
import {requests} from '../api/requests';
import {RootState} from '../store/reducer';

interface MarkProps {
  longitude: number;
  latitude: number;
}

const initialState = {
  addr: {
    area1Name: '',
    area2Name: '',
    area3Name: '',
    area4Name: '',
    landName: '',
    landNumber: 0,
    landValue: '',
  },
};

export const markGet = createAsyncThunk(
  'mark/get',
  async (data: MarkProps, thunkAPI) => {
    const response = await naverInstance.get(
      requests.GET_LOCATE(data.longitude, data.latitude),
    );
    return thunkAPI.fulfillWithValue(response.data);
  },
);

const markSlice = createSlice({
  name: 'marks',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(markGet.pending, state => {
      console.log('pending');
    });
    builder.addCase(markGet.fulfilled, (state, action) => {
      console.log('fulfilled');
      state.addr.area1Name = action.payload.results[0].region.area1.name;
      state.addr.area2Name = action.payload.results[0].region.area2.name;
      state.addr.area3Name = action.payload.results[0].region.area3.name;
      state.addr.area4Name = action.payload.results[0].region.area4.name;
      state.addr.landName = action.payload.results[0].land.name;
      state.addr.landNumber = action.payload.results[0].land.number1;
      state.addr.landValue = action.payload.results[0].land.addition0.value;
    });
    builder.addCase(markGet.rejected, (state, action) => {
      console.log('reject', action.error);
    });
  },
});

export const markAction = markSlice.actions;

export default markSlice.reducer;
