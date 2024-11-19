import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFile } from '../files/interfaces/file.interface';

export interface FilesState {
  files: IFile[];
}

export const initialState: FilesState = {
  files: [],
};

export const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    setFiles: (state, action: PayloadAction<IFile[]>) => {
      state.files = action.payload;
    },
    updateFileStatus: (state, action: PayloadAction<IFile[]>) => {
      state.files = action.payload;
    },
  },
});

export const { setFiles, updateFileStatus } = filesSlice.actions;
export default filesSlice.reducer;
