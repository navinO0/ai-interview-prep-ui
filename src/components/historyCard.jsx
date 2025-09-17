"use client";
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ReactMarkdown from "react-markdown";
import TruncatedMarkdown from "@/utils/truncatedMarkdown";

export default function HistoryCard({ history }) {
  const data = history || [
    {
      id: "1",
      label: "# History\nThis section stores your **interview attempts**.",
      children: [
        {
          id: "1.1",
          label:
            "### Session Management\nRedis is *faster* than Postgres for **sessions**.",
        },
        {
          id: "1.2",
          label: "### Leaderboards\nUse Redis **sorted sets** for ranking.",
        },
      ],
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto grid gap-4 p-4">
      {data.map((item) => (
        <Card
          key={item.id}
          sx={{
            borderRadius: 3,
            boxShadow: 3,
            overflow: "auto",
          }}
        >
          <Accordion sx={{ boxShadow: "none" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                px: 2,
                py: 2,
                "& .MuiAccordionSummary-content": {
                  margin: 0,
                },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                <TruncatedMarkdown text={item.label} />
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ bgcolor: "grey.50", px: 2, py: 2 }}>
              {item.children?.map((child) => (
                <Card
                  key={child.id}
                  variant="outlined"
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    p: 2,
                    "&:last-child": { mb: 0 },
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    component="div"
                  >
                    <ReactMarkdown>{child.label}</ReactMarkdown>
                  </Typography>
                </Card>
              ))}
            </AccordionDetails>
          </Accordion>
        </Card>
      ))}
    </div>
  );
}
