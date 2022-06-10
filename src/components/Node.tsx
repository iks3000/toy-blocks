import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Box,
  Card,
  CardContent
} from "@mui/material";
import { styled } from "@mui/material/styles";
import colors from "../constants/colors";
import Status from "./Status";
import { Node as NodeType } from "../types/Node";

type Props = {
  node: NodeType;
  expanded: boolean;
  toggleNodeExpanded: (node: NodeType) => void;
};

const AccordionRoot = styled(Accordion)({
  margin: "16px 0",
  boxShadow: "0px 3px 6px 1px rgba(0,0,0,0.15)",

  "&:before": {
    backgroundColor: "unset",
  },
});

const AccordionSummaryContainer = styled(AccordionSummary)({
  padding: "0 24px",
  "& .MuiAccordionSummary-content": {
    margin: "10px 0 !important", // Avoid change of sizing on expanded
  },
  "& .MuiAccordionSummary-expandIconWrapper": {
    color: colors.faded,
  },
});

const BoxSummaryContent = styled(Box)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  paddingRight: 20,
});

const TypographyHeading = styled(Typography)({
  fontSize: 17,
  display: "block",
  color: colors.text,
  lineHeight: 1.5,
});

const TypographySecondaryHeading = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  color: colors.faded,
  lineHeight: 2,
}));

const CardBlock = styled(Card)({
  marginBottom: 8,
  paddingBottom: 0,
  backgroundColor: "#e0e0e0"
});

const CardContentBlock = styled(CardContent)({
  padding: 8,
  '&:last-child': {
    paddingBottom: 8,
  }
});

const TypographyID = styled(Typography)({
  color: "#304FFE",
  fontFamily: 'Roboto',
  fontSize: 10,
  letterSpacing: 1.5,
  fontWeight: 700
});

const TypographyData = styled(Typography)({
  fontFamily: 'Roboto',
  fontSize: 14,
  letterSpacing: 0.25
});

const Node: React.FC<Props> = ({ node, expanded, toggleNodeExpanded }) => {
  // ***  from Yevgeniy ***
  //  Here you can edit display style of each block
  // Card color is #e0e0e0
  // Id color is #304FFE
  let content = node.blocks.map((block, id) => (
    <CardBlock key={id}>
      <CardContentBlock>
        <TypographyID>
          {block.id < 10 ? "00" + block.id : block.id }
        </TypographyID>
        <TypographyData>
          {block.data}
        </TypographyData>
      </CardContentBlock>
    </CardBlock>
  ));

  return (
    <AccordionRoot
      elevation={3}
      expanded={expanded}
      onChange={() => toggleNodeExpanded(node)}
    >
      <AccordionSummaryContainer expandIcon={<ExpandMoreIcon />}>
        <BoxSummaryContent>
          <Box>
            <TypographyHeading variant="h5">
              {node.name || "Unknown"}
            </TypographyHeading>
            <TypographySecondaryHeading variant="subtitle1">
              {node.url}
            </TypographySecondaryHeading>
          </Box>
          <Status loading={node.loading} online={node.online} />
        </BoxSummaryContent>
      </AccordionSummaryContainer>
      <AccordionDetails>
        { /* *** from Yevgeniy *** */
          /* display blocks information */}
        <Typography variant="h6">
          {
            !node.online ? "No Connection" :
              node.loadingBlocks ? "Loading..." :
                node.blocks.length !== 0 ? content : "No Blocks"
          }
        </Typography>

      </AccordionDetails>
    </AccordionRoot>
  );
};

export default Node;
