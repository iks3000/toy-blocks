import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import initialState from "./initialState";
import { Node } from "../types/Node";
import { RootState } from "../store/configureStore";
import fetch from "cross-fetch";

export interface NodesState {
  list: Node[];
}

export const checkNodeStatus = createAsyncThunk(
  "nodes/checkNodeStatus",
  async (node: Node, thunkAPI) => {
    try {
      const response = await fetch(`${node.url}/api/v1/status`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: { node_name: string } = await response.json();
      return data;
    } catch (error) {
      // Log error for debugging
      console.warn(`Failed to check status for ${node.url}:`, error);
      throw error;
    }
  }
);

// Returns blocks information from each node
export const fetchBlocks = createAsyncThunk(
  "nodes/fetchBlocks",
  async (node: Node) => {
    try {
      const response = await fetch(`${node.url}/api/v1/blocks`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const blocks: { data: Array<any> } = await response.json();
      return blocks;
    } catch (error) {
      // Log error for debugging
      console.warn(`Failed to fetch blocks for ${node.url}:`, error);
      throw error;
    }
  }
);

export const checkNodesStatus = createAsyncThunk(
  "nodes/checkNodesStatus",
  async (nodes: Node[], thunkAPI) => {
    const { dispatch } = thunkAPI;

    // Run checks in parallel, handle errors individually
    const promises = nodes.map(async (node) => {
      try {
        await dispatch(checkNodeStatus(node)).unwrap();
        // If status is successful, fetch blocks
        await dispatch(fetchBlocks(node)).unwrap();
      } catch (error) {
        // Errors are already handled in individual thunks
        console.warn(`Node ${node.url} failed:`, error);
      }
    });

    await Promise.allSettled(promises);
  }
);

export const nodesSlice = createSlice({
  name: "nodes",
  initialState: initialState().nodes as NodesState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(checkNodeStatus.pending, (state, action) => {
      const node = state.list.find((n) => n.url === action.meta.arg.url);
      if (node) node.loading = true;
    });
    builder.addCase(checkNodeStatus.fulfilled, (state, action) => {
      const node = state.list.find((n) => n.url === action.meta.arg.url);
      if (node) {
        node.online = true;
        node.loading = false;
        node.name = action.payload.node_name;
      }
    });
    builder.addCase(checkNodeStatus.rejected, (state, action) => {
      const node = state.list.find((n) => n.url === action.meta.arg.url);
      if (node) {
        node.online = false;
        node.loading = false;
        // Save error info for display
        node.error = action.error.message || "Unknown error";
      }
    });
    // Start loading blocks
    builder.addCase(fetchBlocks.pending, (state, action) => {
      const node = state.list.find((n) => n.url === action.meta.arg.url);
      if (node) {
        node.loadingBlocks = true;
        node.blocks = [];
      }
    });
    // Finished loading blocks
    builder.addCase(fetchBlocks.fulfilled, (state, action) => {
      const node = state.list.find((n) => n.url === action.meta.arg.url);
      if (node) {
        node.loadingBlocks = false;
        let data = action.payload.data;
        node.blocks = [];
        data.forEach((item) => {
          const block = {
            id: item.id,
            data: item.attributes.data,
          };
          node.blocks.push(block);
        });
      }
    });
    // Failed loading blocks
    builder.addCase(fetchBlocks.rejected, (state, action) => {
      const node = state.list.find((n) => n.url === action.meta.arg.url);
      if (node) {
        node.loadingBlocks = false;
        node.blocks = [];
        // Save error info for blocks
        node.blocksError = action.error.message || "Failed to load blocks";
      }
    });
  },
});

export const selectNodes = (state: RootState) => state.nodes.list;
export default nodesSlice.reducer;
