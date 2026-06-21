"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useDictionary } from "@/app/lib/language/DictionaryContext";

interface SupportPageClientProps {
  pageKey: "devDocsPage" | "helpCenterPage" | "privacyPage" | "slaPage";
}

export default function SupportPageClient({ pageKey }: SupportPageClientProps) {
  const dict = useDictionary();
  const sDict = dict.landing[pageKey];
  const [activeIdx, setActiveIdx] = useState(0);

  if (!sDict) {
    return (
      <Box sx={{ p: 10, color: "white", bgcolor: "black" }}>
        Error: {pageKey} dictionary configuration is missing.
      </Box>
    );
  }

  // Pre-configured FAQs based on pageKey
  const renderFAQs = () => {
    if (pageKey === "helpCenterPage") {
      const helpDict = sDict as typeof dict.landing.helpCenterPage;
      const faqsList = helpDict.faqs || [
        {
          q: "LogiTrack WMS entegrasyonu ne kadar sürer?",
          a: "Temel WMS entegrasyonları, hazır API konektörlerimiz ve webhook sistemimiz sayesinde 2-4 saat içinde tamamlanabilmektedir.",
        },
        {
          q: "Sürücüler için ek bir cihaz gerekir mi?",
          a: "Hayır. Sürücüleriniz, iOS veya Android tabanlı herhangi bir akıllı telefon üzerinden LogiTrack sürücü uygulamasını indirip kullanabilirler.",
        },
        {
          q: "Verilerimiz nerede depolanıyor?",
          a: "Tüm verileriniz, SOC2 standartlarına uyumlu, tamamen şifrelenmiş güvenli bulut sunucularımızda saklanır.",
        },
      ];
      return (
        <Box sx={{ mt: 8 }}>
          <Typography variant="h5" fontWeight={800} color="#fff" mb={4}>
            {helpDict.faqTitle || "Frequently Asked Questions"}
          </Typography>
          {faqsList.map((faq: { q: string; a: string }, idx: number) => (
            <Accordion
              key={idx}
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                color: "#fff",
                mb: 2,
                "&:before": { display: "none" },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}>
                <Typography fontWeight={700}>{faq.q}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ borderTop: "1px solid rgba(255,255,255,0.05)", pt: 2 }}>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
                  {faq.a}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#030712",
        color: "#f3f4f6",
        position: "relative",
        overflow: "hidden",
        pt: 15,
        pb: 10,
      }}
    >
      {/* Background Gradients */}
      <Box
        sx={{
          position: "absolute",
          top: "-15%",
          left: "-10%",
          width: "50%",
          height: "60%",
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.04) 0%, transparent 70%)",
          filter: "blur(140px)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-15%",
          right: "-10%",
          width: "50%",
          height: "60%",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.04) 0%, transparent 70%)",
          filter: "blur(140px)",
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Grid container spacing={6}>
          {/* Left Navigation Outline */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper
              sx={{
                p: 3,
                bgcolor: "rgba(255, 255, 255, 0.01)",
                border: "1px solid rgba(255, 255, 255, 0.03)",
                borderRadius: "16px",
                position: { md: "sticky" },
                top: 100,
              }}
            >
              <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.4)", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
                {dict.common?.outline || "Page Outline"}
              </Typography>
              <List sx={{ mt: 2 }}>
                {sDict.sections.map((section: { title: string }, idx: number) => (
                  <ListItem disablePadding key={idx} sx={{ mb: 1 }}>
                    <ListItemButton
                      selected={activeIdx === idx}
                      onClick={() => setActiveIdx(idx)}
                      sx={{
                        borderRadius: "8px",
                        bgcolor: activeIdx === idx ? "rgba(255, 255, 255, 0.05)" : "transparent",
                        color: activeIdx === idx ? "#00f2ff" : "rgba(255, 255, 255, 0.6)",
                        "&.Mui-selected": {
                          bgcolor: "rgba(255, 255, 255, 0.05)",
                          color: "#00f2ff",
                        },
                      }}
                    >
                      <ListItemText primary={section.title} primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: 700 }} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Main Reading Pane */}
          <Grid size={{ xs: 12, md: 9 }}>
            <Paper
              sx={{
                p: { xs: 4, md: 6 },
                bgcolor: "rgba(255, 255, 255, 0.01)",
                border: "1px solid rgba(255, 255, 255, 0.03)",
                borderRadius: "16px",
              }}
            >
              {/* Header */}
              <Box sx={{ mb: 6 }}>
                <Typography variant="h3" fontWeight={900} mb={2} color="#fff">
                  {sDict.hero.title}
                </Typography>
                <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "1.1rem" }}>
                  {sDict.hero.subtitle}
                </Typography>
              </Box>
              <Divider sx={{ borderColor: "rgba(255,255,255,0.05)", mb: 6 }} />

              {/* Active Section Content */}
              <Box sx={{ minHeight: 200 }}>
                <Typography variant="h5" fontWeight={800} color="#00f2ff" mb={3}>
                  {sDict.sections[activeIdx]?.title}
                </Typography>
                <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.8 }}>
                  {sDict.sections[activeIdx]?.content}
                </Typography>
              </Box>

              {/* Render custom FAQ widgets */}
              {renderFAQs()}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
