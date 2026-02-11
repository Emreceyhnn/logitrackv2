"use client";

import * as Yup from "yup";
import { useRouter } from "next/navigation";
import {
    Box,
    Button,
    Stack,
    Typography,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import type { FormikHelpers } from "formik";
import { useState, useEffect } from "react";
import { StyledTextFieldAuth } from "@/app/lib/styled/styledFieldBox";
import CircularIndeterminate from "../loading";
import { createCompany } from "@/app/lib/controllers/company"; // You'll need to export this from your controller

interface CreateCompanyFormValues {
    companyName: string;
    avatarUrl?: string;
}

interface CreateCompanyFormProps {
    onSuccess?: (company: any) => void;
}

export default function CreateCompanyForm({ onSuccess }: CreateCompanyFormProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    // Redirect if user already has a company
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            if (user.companyId && !onSuccess) {
                router.push("/");
            }
        } else {
            router.push("/auth/sign-in");
        }
    }, [router, onSuccess]);

    const handleSubmit = async (
        values: CreateCompanyFormValues,
        actions: FormikHelpers<CreateCompanyFormValues>
    ) => {
        setLoading(true);
        try {


            const storedUser = localStorage.getItem("user");
            if (!storedUser) {
                throw new Error("User not found. Please log in again.");
            }

            const user = JSON.parse(storedUser);

            const result = await createCompany(user.id, values.companyName, values.avatarUrl);

            // Update local storage user with new company info
            localStorage.setItem("user", JSON.stringify(result.user));

            if (onSuccess) {
                onSuccess(result.company);
            } else {
                router.push("/overview"); // Redirect to dashboard
                router.refresh(); // Refresh to ensure server components update
            }

        } catch (error: any) {
            console.error("Failed to create company:", error);
            actions.setFieldError("companyName", error.message || "Failed to create company");
        } finally {
            setLoading(false);
        }
    };

    const CompanySchema = Yup.object({
        companyName: Yup.string().min(2, "Name too short").required("Company Name is required"),
        avatarUrl: Yup.string().url("Must be a valid URL").optional(),
    });

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
                        mb: 1
                    }}
                >
                    Create Your Company
                </Typography>
                <Typography
                    sx={{
                        fontWeight: 400,
                        fontSize: "14px",
                        color: "rgba(255, 255, 255, 0.7)",
                        mb: 4
                    }}
                >
                    To get started, please name your company.
                </Typography>

                <Formik<CreateCompanyFormValues>
                    initialValues={{ companyName: "", avatarUrl: "" }}
                    onSubmit={handleSubmit}
                    validationSchema={CompanySchema}
                >
                    <Form>
                        <Stack spacing={2}>
                            <Field name="companyName">
                                {({ field, meta }: any) => (
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

                            <Field name="avatarUrl">
                                {({ field, meta }: any) => (
                                    <StyledTextFieldAuth
                                        {...field}
                                        type="text"
                                        placeholder="Avatar URL (Optional)"
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
                </Formik>
            </Box>
        </Box>
    );
}
