"use client";

import * as Yup from "yup";
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
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import type { FormikHelpers } from "formik";
import { useState } from "react";
import { StyledTextFieldAuth } from "@/app/lib/styled/styledFieldBox";
import CircularIndeterminate from "../loading";
import { useRouter } from "next/navigation";
import { createUserForCompany } from "@/app/lib/controllers/users";

interface CreateUserFormValues {
    username: string;
    name: string;
    surname: string;
    email: string;
    password: string;
    role: string;
}

export default function CreateUserForm() {
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const handleSubmit = async (
        values: CreateUserFormValues,
        actions: FormikHelpers<CreateUserFormValues>
    ) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Not authenticated");
            }

            // We need to pass the token to the server action so it can verify the requester's company and permissions
            // Ideally server actions can access cookies, but here we are using a manual token.
            // We'll pass it as an argument.
            await createUserForCompany(token, values);

            router.push("/users"); // Redirect to users list (to be created or existing?)
            router.refresh();
        } catch (error: any) {
            console.error("Failed to create user:", error);
            actions.setFieldError("email", error.message || "Failed to create user");
        } finally {
            setLoading(false);
        }
    };

    const UserSchema = Yup.object({
        username: Yup.string().required("Username is required"),
        name: Yup.string().required("Name is required"),
        surname: Yup.string().required("Surname is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
        role: Yup.string().required("Role is required"),
    });

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
                    role: "worker", // Default
                }}
                onSubmit={handleSubmit}
                validationSchema={UserSchema}
            >
                {({ errors, touched, setFieldValue, values }) => (
                    <Form>
                        <Stack spacing={2}>
                            <Field name="username">
                                {({ field, meta }: any) => (
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
                                    {({ field, meta }: any) => (
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
                                    {({ field, meta }: any) => (
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
                                {({ field, meta }: any) => (
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
                                {({ field, meta }: any) => (
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

                            <FormControl fullWidth error={touched.role && Boolean(errors.role)}>
                                <InputLabel sx={{ color: "rgba(255,255,255,0.7)" }}>Role</InputLabel>
                                <Select
                                    value={values.role}
                                    onChange={(e) => setFieldValue("role", e.target.value)}
                                    label="Role"
                                    sx={{
                                        color: "white",
                                        ".MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255, 255, 255, 0.23)" },
                                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255, 255, 255, 0.5)" },
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#38bdf8" },
                                        ".MuiSvgIcon-root": { color: "white" }
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
