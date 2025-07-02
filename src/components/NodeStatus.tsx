import React from "react";
import { Box, Typography, Chip, Alert } from "@mui/material";
import { Node } from "../types/Node";

interface NodeStatusProps {
  node: Node;
}

const NodeStatus = ({ node }: NodeStatusProps) => {
  const getStatusColor = () => {
    if (node.loading) return "default";
    if (node.online) return "success";
    return "error";
  };

  const getStatusText = () => {
    if (node.loading) return "Checking...";
    if (node.online) return "Online";
    return "Offline";
  };

  const isLocalNode = node.url.includes("localhost");

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} marginBottom={1}>
        <Chip
          label={getStatusText()}
          color={getStatusColor() as any}
          size="small"
        />
        {isLocalNode && (
          <Chip label="Local" color="primary" size="small" variant="outlined" />
        )}
      </Box>

      {node.error && (
        <Alert severity="error" sx={{ marginBottom: 1 }}>
          <Typography variant="body2">
            Connection error: {node.error}
          </Typography>
        </Alert>
      )}

      {node.blocksError && (
        <Alert severity="warning" sx={{ marginBottom: 1 }}>
          <Typography variant="body2">
            Failed to load blocks: {node.blocksError}
          </Typography>
        </Alert>
      )}

      {node.loadingBlocks && (
        <Typography variant="body2" color="text.secondary">
          Loading blocks...
        </Typography>
      )}

      {!node.loadingBlocks && node.blocks.length > 0 && (
        <Typography variant="body2" color="text.secondary">
          Blocks: {node.blocks.length}
        </Typography>
      )}
    </Box>
  );
};

export default NodeStatus;
