const NODE4_URL = process.env.REACT_APP_NODE4_URL || "http://localhost:3002";

const initialState = () => ({
  nodes: {
    list: [
      {
        url: "https://thawing-springs-53971.herokuapp.com",
        online: false,
        name: "Node 1",
        loading: false,
        blocks: [], // Array<any> variable which contains information of blocks in node *** from Yevgeniy***
        loadingBlocks: false, // boolean    variable which shows the state of loading blocks progress ***  from Yevgeniy ***
        error: undefined, // string     error message for node status
        blocksError: undefined, // string     error message for blocks loading
      },
      {
        url: "https://secret-lowlands-62331.herokuapp.com",
        online: false,
        name: "Node 2",
        loading: false,
        blocks: [],
        loadingBlocks: false,
        error: undefined,
        blocksError: undefined,
      },
      {
        url: "https://calm-anchorage-82141.herokuapp.com",
        online: false,
        name: "Node 3",
        loading: false,
        blocks: [],
        loadingBlocks: false,
        error: undefined,
        blocksError: undefined,
      },
      {
        url: NODE4_URL,
        online: false,
        name: "Node 4",
        loading: false,
        blocks: [],
        loadingBlocks: false,
        error: undefined,
        blocksError: undefined,
      },
    ],
  },
});
export default initialState;
