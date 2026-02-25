"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Avatar,
  IconButton,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import type { FormikHelpers } from "formik";
import { StyledTextFieldAuth } from "@/app/lib/styled/styledFieldBox";
import CircularIndeterminate from "../loading";
import { useRouter } from "next/navigation";
import { createUserForCompany } from "@/app/lib/controllers/users";
import { createUserValidationSchema } from "@/app/lib/validationSchema";
import { uploadImageAction } from "@/app/lib/actions/upload";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { toast } from "sonner";

interface CreateUserFormValues {
  username: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  role: string;
  avatarUrl?: string;
}

export default function CreateUserForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  // const [avatarFile, setAvatarFile] = useState<File | null>(null); // Removed unused variable
  const router = useRouter();

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void // Fixed type
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // setAvatarFile(file); // Removed unused variable assignment
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        setFieldValue("avatarUrl", reader.result as string); // Temporarily store base64 for preview and later upload
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (
    values: CreateUserFormValues,
    actions: FormikHelpers<CreateUserFormValues>
  ) => {
    setLoading(true);
    try {
      let finalAvatarUrl = "";
      if (values.avatarUrl && values.avatarUrl.startsWith("data:")) {
        const uploadResult = await uploadImageAction(
          values.avatarUrl,
          "avatars"
        );
        finalAvatarUrl = uploadResult.url;
      }

      await createUserForCompany({
        ...values,
        avatarUrl: finalAvatarUrl || undefined,
      });

      toast.success("User created successfully");
      router.push("/users");
      router.refresh();
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : "Failed to create user";
      console.error("Failed to create user:", error);
      toast.error(msg);
      actions.setFieldError("email", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      maxWidth={{ sm: 600, xs: "95%" }}
      width={"100%"}
      bgcolor={"#151515"}
      borderRadius={"8px"}
      p={4}
    >
      <Typography variant="h5" color="white" mb={3}>
        Add New User
      </Typography>

      <Formik<CreateUserFormValues>
        initialValues={{
          username: "",
          name: "",
          surname: "",
          email: "",
          password: "",
          role: "worker",
          avatarUrl: "",
        }}
        onSubmit={handleSubmit}
        validationSchema={createUserValidationSchema}
      >
        {({ errors, touched, setFieldValue, values }) => (
          <Form>
            <Stack spacing={3} alignItems="center" mb={3}>
              <Box position="relative">
                <Avatar
                  src={avatarPreview || undefined}
                  sx={{ width: 100, height: 100, border: "2px solid #38bdf8" }}
                />
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="avatar-upload"
                  type="file"
                  onChange={(e) => handleFileChange(e, setFieldValue)}
                />
                <label htmlFor="avatar-upload">
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
                Upload Profile Picture
              </Typography>
            </Stack>

            <Stack spacing={2}>
              <Field name="username">
                {({ field, meta }: { field: any; meta: any }) => (
                  <StyledTextFieldAuth
                    {...field}
                    placeholder="Username"
                    fullWidth
                    error={meta.touched && Boolean(meta.error)}
                    helperText={meta.touched && meta.error}
                  />
                )}
              </Field>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Field name="name">
                  {({ field, meta }: { field: any; meta: any }) => (
                    <StyledTextFieldAuth
                      {...field}
                      placeholder="Name"
                      fullWidth
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error}
                    />
                  )}
                </Field>
                <Field name="surname">
                  {({ field, meta }: { field: any; meta: any }) => (
                    <StyledTextFieldAuth
                      {...field}
                      placeholder="Surname"
                      fullWidth
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error}
                    />
                  )}
                </Field>
              </Stack>

              <Field name="email">
                {({ field, meta }: { field: any; meta: any }) => (
                  <StyledTextFieldAuth
                    {...field}
                    type="email"
                    placeholder="Email"
                    fullWidth
                    error={meta.touched && Boolean(meta.error)}
                    helperText={meta.touched && meta.error}
                  />
                )}
              </Field>

              <Field name="password">
                {({ field, meta }: { field: any; meta: any }) => (
                  <StyledTextFieldAuth
                    {...field}
                    type="password"
                    placeholder="Password"
                    fullWidth
                    error={meta.touched && Boolean(meta.error)}
                    helperText={meta.touched && meta.error}
                  />
                )}
              </Field>

              <FormControl
                fullWidth
                error={touched.role && Boolean(errors.role)}
              >
                <InputLabel sx={{ color: "rgba(255,255,255,0.7)" }}>
                  Role
                </InputLabel>
                <Select
                  value={values.role}
                  onChange={(e) => setFieldValue("role", e.target.value)}
                  label="Role"
                  sx={{
                    color: "white",
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255, 255, 255, 0.23)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255, 255, 255, 0.5)",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#38bdf8",
                    },
                    ".MuiSvgIcon-root": { color: "white" },
                  }}
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="dispatcher">Dispatcher</MenuItem>
                  <MenuItem value="driver">Driver</MenuItem>
                  <MenuItem value="warehouse">Warehouse</MenuItem>
                </Select>
                {touched.role && errors.role && (
                  <FormHelperText>{errors.role}</FormHelperText>
                )}
              </FormControl>

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
                  Create User
                </Button>
              )}
            </Stack>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
