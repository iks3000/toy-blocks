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
    const response = await fetch(`${node.url}/api/v1/status`);
    const data: { node_name: string } = await response.json();

    // execute fetching blocks dispatch ***from Yevgeniy***
    // const { dispatch } = thunkAPI;
    // dispatch(fetchBlocks(node));
    return data;
  }
);

// dispatch@ ***from Yevgeniy***
// return_type: Array<any> return_value: blocks information
// we get information of blocks from each node
export const fetchBlocks = createAsyncThunk(
  "nodes/fetchBlocks",
  async (node: Node ) => {
    const response = await fetch(`${node.url}/api/v1/blocks`);
    const blocks: { data: Array<any> } = await response.json();
    return blocks;
  }
);

export const checkNodesStatus = createAsyncThunk(
  "nodes/checkNodesStatus",
  async (nodes: Node[], thunkAPI) => {
    const { dispatch } = thunkAPI;
    nodes.forEach((node) => {
      dispatch(checkNodeStatus(node)).then(()=>dispatch(fetchBlocks(node)));
    });
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
      }
    });
    // reducer@ from ***Yevgeniy***
    // start loading blocks
    builder.addCase(fetchBlocks.pending, (state, action) => {
      const node = state.list.find((n) => n.url === action.meta.arg.url);
      if (node) {
        node.loadingBlocks = true;
        node.blocks = [];
      }
    });
    // reducer@ from ***Yevgeniy***
    // finished loading blocks
    builder.addCase(fetchBlocks.fulfilled, (state, action) => {
      const node = state.list.find((n) => n.url === action.meta.arg.url);
      if (node) {
        node.loadingBlocks = false;
        let data = action.payload.data;
        node.blocks = [];
        data.forEach(item => {
          const block = {
            id: item.id,
            data: item.attributes.data
          }
          node.blocks.push(block);
        })
      }
    });
    // reducer@ ***from Yevgeniy***
    // failed loading blocks
    builder.addCase(fetchBlocks.rejected, (state, action) => {
      const node = state.list.find((n) => n.url === action.meta.arg.url);
      if (node) {
        node.loadingBlocks = false;
        node.blocks = [];
      }
    });
  },
});

export const selectNodes = (state: RootState) => state.nodes.list;
export default nodesSlice.reducer;
