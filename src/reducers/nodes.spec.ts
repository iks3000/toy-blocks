import mockFetch from "cross-fetch";
import reducer, { checkNodeStatus, fetchBlocks } from "./nodes";
import { Node } from "../types/Node";
import initialState from "./initialState";

jest.mock("cross-fetch");

const mockedFech: jest.Mock<unknown> = mockFetch as any;

describe("Reducers::Nodes", () => {
  const getInitialState = () => {
    return initialState().nodes;
  };

  const nodeA: Node = {
    url: "http://localhost:3017",
    online: false,
    name: "Node 1",
    loading: false,
    loadingBlocks: false,
    blocks: [],
  };

  const nodeB = {
    url: "http://localhost:3018",
    online: false,
    name: "Node 2",
    loading: false,
    loadingBlocks: false,
    blocks: [],
  };

  it("should set initial state by default", () => {
    const action = { type: "unknown" };
    const expected = getInitialState();

    expect(reducer(undefined, action)).toEqual(expected);
  });

  it("should handle checkNodeStatus.pending", () => {
    const appState = {
      list: [nodeA, nodeB],
    };
    const action = { type: checkNodeStatus.pending, meta: { arg: nodeA } };
    const expected = {
      list: [
        {
          ...nodeA,
          loading: true,
        },
        nodeB,
      ],
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

  it("should handle checkNodeStatus.fulfilled", () => {
    const appState = {
      list: [nodeA, nodeB],
    };
    const action = {
      type: checkNodeStatus.fulfilled,
      meta: { arg: nodeA },
      payload: { node_name: "alpha" },
    };
    const expected = {
      list: [
        {
          ...nodeA,
          online: true,
          name: "alpha",
          loading: false,
        },
        nodeB,
      ],
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

  it("should handle checkNodeStatus.rejected", () => {
    const appState = {
      list: [
        {
          ...nodeA,
          online: true,
          name: "alpha",
          loading: false,
        },
        nodeB,
      ],
    };
    const action = { type: checkNodeStatus.rejected, meta: { arg: nodeA } };
    const expected = {
      list: [
        {
          ...nodeA,
          online: false,
          name: "alpha",
          loading: false,
        },
        nodeB,
      ],
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

  // checking fetchBlocks reducer's working
  it("should handle fetchBlocks.pending", () => {
    const appState = {
      list: [nodeA, nodeB],
    };
    const action = { type: fetchBlocks.pending, meta: { arg: nodeA } };
    const expected = {
      list: [
        {
          ...nodeA,
          loadingBlocks: true,
        },
        nodeB,
      ],
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

  it("should handle fetchBlocks.fulfilled", () => {
    const appState = {
      list: [nodeA, nodeB],
    };
    const action = {
      type: fetchBlocks.fulfilled,
      meta: { arg: nodeA },
      payload: {
          data: [{
            id: 5,
            attributes: {
              data: "working first"
            }
          }]
        },
    };
    const expected = {
      list: [
        {
          ...nodeA,
          loadingBlocks: false,
          blocks: [
            {
              id: 5,
              data: "working first",
            }
          ]
        },
        nodeB,
      ],
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

  it("should handle fetchBlocks.rejected", () => {
    const appState = {
      list: [
        {
          ...nodeA,
          loadingBlocks: false,
          blocks: [
            {
              id: 5,
              data: "working second"
            }
          ],
        },
        nodeB,
      ],
    };
    const action = { type: fetchBlocks.rejected, meta: { arg: nodeA } };
    const expected = {
      list: [
        {
          ...nodeA,
          loadingBlocks: false,
          blocks: [],
        },
        nodeB,
      ],
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

});

describe("Actions::Nodes", () => {
  const dispatch = jest.fn();

  afterAll(() => {
    dispatch.mockClear();
    mockedFech.mockClear();
  });

  const node: Node = {
    url: "http://localhost:3002",
    online: false,
    name: "Node 1",
    loading: false,
    loadingBlocks: false,
    blocks: [],
  };

  it("should fetch the node status", async () => {
    mockedFech.mockReturnValueOnce(
      Promise.resolve({
        status: 200,
        json() {
          return Promise.resolve({ node_name: "Secret Lowlands" });
        },
      })
    );
    await checkNodeStatus(node)(dispatch, () => {}, {});

    const expected = expect.arrayContaining([
      expect.objectContaining({
        type: checkNodeStatus.pending.type,
        meta: expect.objectContaining({ arg: node }),
      }),
      expect.objectContaining({
        type: checkNodeStatus.fulfilled.type,
        meta: expect.objectContaining({ arg: node }),
        payload: { node_name: "Secret Lowlands" },
      }),
    ]);
    expect(dispatch.mock.calls.flat()).toEqual(expected);
  });

  it("should fail to fetch the node status", async () => {
    mockedFech.mockReturnValueOnce(Promise.reject(new Error("Network Error")));
    await checkNodeStatus(node)(dispatch, () => {}, {});
    const expected = expect.arrayContaining([
      expect.objectContaining({
        type: checkNodeStatus.pending.type,
        meta: expect.objectContaining({ arg: node }),
      }),
      expect.objectContaining({
        type: checkNodeStatus.rejected.type,
        meta: expect.objectContaining({ arg: node }),
        error: expect.objectContaining({ message: "Network Error" }),
      }),
    ]);
  });

  it("should fetch the blocks", async () => {
    mockedFech.mockReturnValueOnce(
      Promise.resolve({
        status: 200,
        json() {
          return Promise.resolve({
            data: [{
              id: 5,
              attributes: {
                data: "working first"
              }
            }]
          });
        },
      })
    );
    await fetchBlocks(node)(dispatch, () => {}, {});

    const expected = expect.arrayContaining([
      expect.objectContaining({
        type: fetchBlocks.pending.type,
        meta: expect.objectContaining({ arg: node }),
      }),
      expect.objectContaining({
        type: fetchBlocks.fulfilled.type,
        meta: expect.objectContaining({ arg: node }),
        payload: {
          data: [{
            id: 5,
            attributes: {
              data: "working first"
            }
          }]
        },
      }),
    ]);
    expect(dispatch.mock.calls.flat()).toEqual(expected);
  });

  it("should fail to fetch the blocks", async () => {
    mockedFech.mockReturnValueOnce(Promise.reject(new Error("Network Error")));
    await fetchBlocks(node)(dispatch, () => {}, {});
    const expected = expect.arrayContaining([
      expect.objectContaining({
        type: fetchBlocks.pending.type,
        meta: expect.objectContaining({ arg: node }),
      }),
      expect.objectContaining({
        type: fetchBlocks.rejected.type,
        meta: expect.objectContaining({ arg: node }),
        error: expect.objectContaining({ message: "Network Error" }),
      }),
    ]);
    expect(dispatch.mock.calls.flat()).toEqual(expected);
  });

});
