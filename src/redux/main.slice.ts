import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { DataLacCell } from "../types/type";

interface IMain {
    data: { att: any, det: any };
    dataSuccess: boolean;
    dataEmpty: boolean;
    alertWarning: boolean;
    loading: boolean;
    error: Error | null
}

const initialState: IMain = {
    data: { att: '', det: '' },
    dataSuccess: false,
    dataEmpty: false,
    alertWarning: false,
    loading: false,
    error: null
}

export const getData = createAsyncThunk(
    'post/data',
    async (data: DataLacCell) => {
        const url = `http://localhost:18000/post/`;
        const requestData = {
            lac: data.arrLac,
            cell: data.arrCell
        }
        const result: IMain = await axios.post(url, requestData);
        console.log(result.data);
        
        return result.data
    }
)

export const mainSlice = createSlice({
    name: "main",
    initialState,
    reducers: {
        setDataSuccess: (state, action) => {
            state.dataSuccess = action.payload
        },
        setDataEmpty: (state, action) => {
            state.dataEmpty = action.payload
        },
        setAlertWarning: (state, action) => {
            state.alertWarning = action.payload
        },
        setData: (state, action) => {
            state.data = action.payload
        }
    },
    extraReducers: builder => {
        builder
            .addCase(getData.fulfilled, (state, action: any) => {
                state.data.det = action.payload.det;
                state.data.att = action.payload.att;
                if (action.payload.det.length === 0 && action.payload.att.length === 0) {
                    state.dataEmpty = true;
                } else {
                    state.dataSuccess = true;
                }
                state.loading = false;
            })
            .addCase(getData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getData.rejected, (state, action) => {
                state.error = action.error as Error;
                state.loading = false;
            })
    }
})
export const { setDataSuccess, setDataEmpty, setAlertWarning, setData } = mainSlice.actions