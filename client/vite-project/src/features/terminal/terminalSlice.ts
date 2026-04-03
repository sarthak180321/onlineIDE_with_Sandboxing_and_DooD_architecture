import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface TerminalTab {
    id: string;
    title: string;
}

interface TerminalState {
    tabs: TerminalTab[];
    activeTabId: string | null;
}

const initialState: TerminalState = {
    tabs: [],
    activeTabId: null,
};

const terminalSlice = createSlice({
    name: 'terminal',
    initialState,
    reducers: {
        addTab: (state, action: PayloadAction<TerminalTab>) => {
            state.tabs.push(action.payload);
            state.activeTabId = action.payload.id;
        },
        removeTab: (state, action: PayloadAction<string>) => {
            state.tabs = state.tabs.filter(t => t.id !== action.payload);
            // If removed tab was active, switch to last tab
            if (state.activeTabId === action.payload) {
                state.activeTabId = state.tabs[state.tabs.length - 1]?.id ?? null;
            }
        },
        setActiveTab: (state, action: PayloadAction<string>) => {
            state.activeTabId = action.payload;
        },
    },
});

export const { addTab, removeTab, setActiveTab } = terminalSlice.actions;
export default terminalSlice.reducer;