import React from "react";
import { Alert, AlertTitle, Box, Typography } from "@mui/material";

interface ErrorStatusProps {
  nodeUrl: string;
  errorType: "CORS" | "CONNECTION_REFUSED" | "GENERAL";
}

const ErrorStatus = ({ nodeUrl, errorType }: ErrorStatusProps) => {
  const getErrorMessage = () => {
    switch (errorType) {
      case "CORS":
        return `CORS error: Server ${nodeUrl} does not allow requests from localhost:3000`;
      case "CONNECTION_REFUSED":
        return `Connection error: Server ${nodeUrl} is not available`;
      default:
        return `Error connecting to ${nodeUrl}`;
    }
  };

  const getSeverity = () => {
    switch (errorType) {
      case "CORS":
        return "warning" as const;
      case "CONNECTION_REFUSED":
        return "error" as const;
      default:
        return "info" as const;
    }
  };

  return (
    <Box marginTop={1}>
      <Alert severity={getSeverity()}>
        <AlertTitle>Connection Issue</AlertTitle>
        <Typography variant="body2">{getErrorMessage()}</Typography>
        {errorType === "CORS" && (
          <Typography variant="body2" marginTop={1}>
            <Typography component="span" fontWeight="bold">
              Solution:
            </Typography>{" "}
            Use the local server or set up a CORS proxy
          </Typography>
        )}
        {errorType === "CONNECTION_REFUSED" && (
          <Typography variant="body2" marginTop={1}>
            <Typography component="span" fontWeight="bold">
              Solution:
            </Typography>{" "}
            Start the local server with{" "}
            <Typography
              component="span"
              fontFamily="monospace"
              bgcolor="grey.100"
              px={1}
            >
              npm run server
            </Typography>
          </Typography>
        )}
      </Alert>
    </Box>
  );
};

export default ErrorStatus;
