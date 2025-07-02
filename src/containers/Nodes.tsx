import React, { useState, useEffect } from "react";
import { Node as NodeType } from "../types/Node";
import Node from "../components/Node";
import { Typography, Box } from "@mui/material";
import { useAppSelector } from "../store/configureStore";
import { useDispatch } from "react-redux";
import { selectNodes, checkNodesStatus } from "../reducers/nodes";

const Nodes = () => {
  const [expandedNodeURL, setExpandedNodeURL] = useState<null | string>(null);
  const nodes = useAppSelector(selectNodes);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkNodesStatus(nodes));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleNodeExpanded(node: NodeType) {
    setExpandedNodeURL(node.url === expandedNodeURL ? null : node.url);
  }

  return (
    <Box paddingTop={7}>
      <Typography variant="h4" component="h1">
        <strong style={{ color: "#000" }}>Nodes</strong>
      </Typography>
      {nodes.map((node) => (
        <Node
          node={node}
          key={node.url}
          expanded={node.url === expandedNodeURL}
          toggleNodeExpanded={toggleNodeExpanded}
        />
      ))}
    </Box>
  );
};

export default Nodes;
