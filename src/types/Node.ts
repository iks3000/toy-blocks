export interface Node {
  online: boolean;
  name: string;
  url: string;
  loading: boolean;
  blocks: Array<any>;       // Array<any> all the blocks information in this node
  loadingBlocks: boolean;   // boolean    boolean 
}
