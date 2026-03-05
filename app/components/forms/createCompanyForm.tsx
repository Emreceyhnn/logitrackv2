"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Stack, Typography } from "@mui/material";
import { Field, Form, Formik } from "formik";
import type { FormikHelpers, FormikErrors, FieldProps } from "formik";
import { StyledTextFieldAuth } from "@/app/lib/styled/styledFieldBox";
import CircularIndeterminate from "../loading";
import { createCompany } from "@/app/lib/controllers/company";
import { createCompanyValidationSchema } from "@/app/lib/validationSchema";
import { uploadImageAction } from "@/app/lib/actions/upload";
import { Avatar, IconButton } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { toast } from "sonner";

interface CreateCompanyFormValues {
  companyName: string;
  avatarUrl?: string;
}

interface CreateCompanyFormProps {
  onSuccess?: (company: unknown) => void;
}

export default function CreateCompanyForm({
  onSuccess,
}: CreateCompanyFormProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const router = useRouter();

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (
      field: string,
      value: unknown,
      shouldValidate?: boolean
    ) => Promise<void | FormikErrors<CreateCompanyFormValues>>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        setFieldValue("avatarUrl", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (
    values: CreateCompanyFormValues,
    actions: FormikHelpers<CreateCompanyFormValues>
  ) => {
    setLoading(true);
    try {
      let finalLogoUrl = "";
      if (values.avatarUrl && values.avatarUrl.startsWith("data:")) {
        const uploadResult = await uploadImageAction(values.avatarUrl, "logos");
        finalLogoUrl = uploadResult.url;
      }

      const result = await createCompany(
        values.companyName,
        finalLogoUrl || undefined
      );

      toast.success("Company created successfully");
      if (onSuccess) {
        onSuccess(result.company);
      } else {
        router.refresh();
        router.push("/overview");
      }
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : "Failed to create company";
      console.error("Failed to create company:", error);
      toast.error(msg);
      actions.setFieldError("companyName", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      maxWidth={{ sm: 450, xs: "95%" }}
      width={"100%"}
      bgcolor={"#151515"}
      borderRadius={"8px"}
    >
      <Box p="40px">
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: "24px",
            letterSpacing: "-0.02em",
            color: "#FFFFFF",
            mb: 1,
          }}
        >
          Create Your Company
        </Typography>
        <Typography
          sx={{
            fontWeight: 400,
            fontSize: "14px",
            color: "rgba(255, 255, 255, 0.7)",
            mb: 4,
          }}
        >
          To get started, please name your company.
        </Typography>

        <Formik<CreateCompanyFormValues>
          initialValues={{ companyName: "", avatarUrl: "" }}
          onSubmit={handleSubmit}
          validationSchema={createCompanyValidationSchema}
        >
          {({ setFieldValue }) => (
            <Form>
              <Stack spacing={3} alignItems="center" mb={3}>
                <Box position="relative">
                  <Avatar
                    src={logoPreview || undefined}
                    sx={{
                      width: 100,
                      height: 100,
                      border: "2px solid #38bdf8",
                    }}
                  />
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="logo-upload"
                    type="file"
                    onChange={(e) => handleFileChange(e, setFieldValue)}
                  />
                  <label htmlFor="logo-upload">
                    <IconButton
                      component="span"
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        backgroundColor: "#38bdf8",
                        "&:hover": { backgroundColor: "#0ea5e9" },
                      }}
                      size="small"
                    >
                      <PhotoCameraIcon sx={{ color: "white", fontSize: 18 }} />
                    </IconButton>
                  </label>
                </Box>
                <Typography variant="caption" color="rgba(255,255,255,0.5)">
                  Upload Company Logo
                </Typography>
              </Stack>

              <Stack spacing={2}>
                <Field name="companyName">
                  {({ field, meta }: FieldProps<CreateCompanyFormValues>) => (
                    <StyledTextFieldAuth
                      {...field}
                      type="text"
                      placeholder="Company Name"
                      fullWidth
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error}
                    />
                  )}
                </Field>

                {loading ? (
                  <CircularIndeterminate />
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      mt: 2,
                      width: "100%",
                      backgroundColor: "#38bdf8",
                      fontWeight: 500,
                      fontSize: "14px",
                      padding: "12px",
                      borderRadius: 8,
                      "&:hover": {
                        backgroundColor: "transparent",
                        border: "1px solid #38bdf8",
                        color: "#fff",
                      },
                    }}
                  >
                    Create Company
                  </Button>
                )}
              </Stack>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
}
