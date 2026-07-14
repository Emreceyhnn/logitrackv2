"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { keyframes } from "@mui/system";
import SendIcon from "@mui/icons-material/Send";
import { Formik } from "formik";
import { toast } from "sonner";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import {
  submitDemoRequest,
  type DemoRequestKind,
} from "@/app/lib/actions/demoRequest";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

interface ContactFormValues {
  fullName: string;
  email: string;
  company: string;
  message: string;
}

const initialValues: ContactFormValues = {
  fullName: "",
  email: "",
  company: "",
  message: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactClient({
  kind = "CONTACT",
}: {
  kind?: DemoRequestKind;
}) {
  const dict = useDictionary();
  const cDict = dict?.landing?.contactPage;
  const [submitted, setSubmitted] = useState(false);

  if (!cDict) {
    return (
      <Box sx={{ p: 10, color: "white", bgcolor: "#0f172a" }}>
        Error: contactPage dictionary is missing.
      </Box>
    );
  }

  const validate = (values: ContactFormValues) => {
    const errors: Partial<Record<keyof ContactFormValues, string>> = {};
    if (!values.fullName.trim())
      errors.fullName = cDict.validation.fullNameRequired;
    if (!values.email.trim()) errors.email = cDict.validation.emailRequired;
    else if (!EMAIL_RE.test(values.email.trim()))
      errors.email = cDict.validation.emailInvalid;
    return errors;
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      bgcolor: "rgba(255,255,255,0.03)",
      color: "#f1f5f9",
      "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
      "&:hover fieldset": { borderColor: "rgba(56,189,248,0.4)" },
      "&.Mui-focused fieldset": { borderColor: "#38bdf8" },
    },
    "& .MuiInputLabel-root": { color: "rgba(241,245,249,0.6)" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#38bdf8" },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#0f172a",
        color: "#f1f5f9",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background gradients */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 20% 20%, #3b82f626 0%, transparent 40%)," +
            "radial-gradient(circle at 80% 80%, #6366f11a 0%, transparent 50%)",
          zIndex: 0,
        }}
      />

      <Container
        maxWidth="sm"
        sx={{
          position: "relative",
          zIndex: 1,
          pt: { xs: 14, md: 20 },
          pb: { xs: 10, md: 16 },
        }}
      >
        <Stack
          spacing={3}
          alignItems="center"
          textAlign="center"
          mb={6}
          sx={{ animation: `${fadeIn} 0.8s ease-out` }}
        >
          <Chip
            label={cDict.badge}
            sx={{
              borderRadius: "999px",
              px: 2,
              py: 0.5,
              bgcolor: "rgba(56,189,248,0.1)",
              border: "1px solid rgba(56,189,248,0.3)",
              color: "#38bdf8",
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: "uppercase",
              fontSize: "0.75rem",
            }}
          />
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 800,
              lineHeight: 1.1,
              background:
                "linear-gradient(120deg, #f8fafc 0%, #38bdf8 55%, #a855f7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {cDict.title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "rgba(241,245,249,0.7)",
              maxWidth: 520,
              lineHeight: 1.6,
            }}
          >
            {cDict.subtitle}
          </Typography>
        </Stack>

        {submitted ? (
          <Box
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 4,
              textAlign: "center",
              background: "linear-gradient(135deg, #38bdf81a 0%, #6366f10d 100%)",
              border: "1px solid rgba(56,189,248,0.2)",
              animation: `${fadeIn} 0.5s ease-out`,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#38bdf8" }}>
              {cDict.success}
            </Typography>
          </Box>
        ) : (
          <Formik
            initialValues={initialValues}
            validate={validate}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              const result = await submitDemoRequest({
                fullName: values.fullName,
                email: values.email,
                company: values.company || undefined,
                message: values.message || undefined,
                type: kind,
              });
              setSubmitting(false);

              if (result.success) {
                toast.success(cDict.success);
                resetForm();
                setSubmitted(true);
              } else {
                toast.error(cDict.error);
              }
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  p: { xs: 3, md: 5 },
                  borderRadius: 4,
                  background: "rgba(15,23,42,0.5)",
                  border: "1px solid rgba(56,189,248,0.1)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Stack spacing={3}>
                  <TextField
                    name="fullName"
                    label={cDict.form.fullName}
                    value={values.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.fullName && Boolean(errors.fullName)}
                    helperText={touched.fullName && errors.fullName}
                    fullWidth
                    required
                    sx={inputSx}
                  />
                  <TextField
                    name="email"
                    type="email"
                    label={cDict.form.email}
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    fullWidth
                    required
                    sx={inputSx}
                  />
                  <TextField
                    name="company"
                    label={cDict.form.company}
                    value={values.company}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    sx={inputSx}
                  />
                  <TextField
                    name="message"
                    label={cDict.form.message}
                    placeholder={cDict.form.messagePlaceholder}
                    value={values.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    multiline
                    minRows={4}
                    sx={inputSx}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    endIcon={<SendIcon />}
                    sx={{
                      py: 1.5,
                      fontWeight: 800,
                      textTransform: "none",
                      fontSize: "1rem",
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #22d3ee, #2563eb)",
                      boxShadow: "0 12px 30px rgba(37, 99, 235, 0.35)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #0ea5e9, #1d4ed8)",
                      },
                    }}
                  >
                    {isSubmitting ? cDict.form.submitting : cDict.form.submit}
                  </Button>
                </Stack>
              </Box>
            )}
          </Formik>
        )}
      </Container>
    </Box>
  );
}
