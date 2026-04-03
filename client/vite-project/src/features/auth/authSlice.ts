import {createSlice,createAsyncThunk, type PayloadAction} from "@reduxjs/toolkit";
import {api} from "../../api/api";


interface AuthState{
    token:string|null,
    containerId:string|null,
    loading:boolean,
    error:string|null
}
const initialState:AuthState={
    token:localStorage.getItem('token'),
    containerId:localStorage.getItem('containerId'),
    loading:false,
    error:null
}
export const register=createAsyncThunk(
    'auth/register',
    async(credentials:{email:string,password:string},thunkAPI)=>{
        try{
            return await api.post('/auth/register',credentials);
        }
        catch(err:any){
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const login=createAsyncThunk(
    'auth/login',
    async(credentials:{email:string,password:string},thunkAPI)=>{
        try{
            return await api.post('/auth/login',credentials);
        }
        catch(err:any){
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const logout=createAsyncThunk(
    'auth/logout',
    async(_,thunkAPI)=>{
        try{
            return await api.post('/auth/logout');
        }
        catch(err:any){
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action: PayloadAction<{ token: string; containerId: string }>) => {
                state.loading = false;
                state.token = action.payload.token;
                state.containerId = action.payload.containerId;
                localStorage.setItem('token', action.payload.token);
                localStorage.setItem('containerId', action.payload.containerId);
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<{ token: string; containerId: string }>) => {
                state.loading = false;
                state.token = action.payload.token;
                state.containerId = action.payload.containerId;
                localStorage.setItem('token', action.payload.token);
                localStorage.setItem('containerId', action.payload.containerId);
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(logout.fulfilled, (state) => {
                state.token = null;
                state.containerId = null;
                localStorage.removeItem('token');
                localStorage.removeItem('containerId');
            });
    },
});
export default authSlice.reducer;