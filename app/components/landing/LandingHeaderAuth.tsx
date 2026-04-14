"use client";

import { useState, useEffect } from "react";
import { Button, Stack, CircularProgress, alpha } from "@mui/material";
import Link from "next/link";
import { getUserSession } from "@/app/lib/actions/auth";
import CreateCompanyDialog from "../dialogs/company/CreateCompanyDialog";
import UserAccountNav from "../nav/UserAccountNav";
import { useParams } from "next/navigation";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { getLocalizedPath } from "@/app/lib/language/navigation";

export default function LandingHeaderAuth() {
  const params = useParams();
  const lang = (params?.lang as string) || "tr";
  const dict = useDictionary();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{
    id: string;
    companyId: string | null;
  } | null>(null);

  const [openCompanyModal, setOpenCompanyModal] = useState(false);

  const checkAuth = async () => {
    setLoading(true);
    try {
      const session = await getUserSession();
      setUser(session);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleSuccess = () => {
    setOpenCompanyModal(false);
    checkAuth();
  };

  if (loading) {
    return <CircularProgress size={24} sx={{ color: "#38bdf8" }} />;
  }

  if (user) {
    return (
      <>
        <Stack direction="row" spacing={2} alignItems="center">
          <UserAccountNav />

          {user.companyId ? (
            <Button
              variant="contained"
              component={Link}
              href={`/${lang}${getLocalizedPath("/overview", lang)}`}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                px: 3,
                height: 40,
                borderRadius: "999px",
                background: "linear-gradient(135deg, #22d3ee, #2563eb)",
                boxShadow: "0 12px 30px rgba(37, 99, 235, 0.35)",
                "&:hover": {
                  background: "linear-gradient(135deg, #0ea5e9, #1d4ed8)",
                  transform: "scale(1.02)",
                },
                transition: "all 0.2s",
              }}
            >
              {dict.navbar.dashboard}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={() => setOpenCompanyModal(true)}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                px: 3,
                height: 40,
                borderRadius: "999px",
                background: "linear-gradient(135deg, #22d3ee, #2563eb)",
                boxShadow: "0 12px 30px rgba(37, 99, 235, 0.35)",
                "&:hover": {
                  background: "linear-gradient(135deg, #0ea5e9, #1d4ed8)",
                  transform: "scale(1.02)",
                },
                transition: "all 0.2s",
              }}
            >
              {dict.navbar.setupOrg}
            </Button>
          )}
        </Stack>

        <CreateCompanyDialog
          open={openCompanyModal}
          onClose={() => setOpenCompanyModal(false)}
          onSuccess={handleSuccess}
        />
      </>
    );
  }

  return (
    <Stack direction="row" spacing={2}>
      <Button
        variant="text"
        component={Link}
        href={`/${lang}${getLocalizedPath("/auth/sign-in", lang)}`}
        sx={{
          color: alpha("#e2e8f0", 0.8),
          fontWeight: 600,
          textTransform: "none",
          "&:hover": { color: "#38bdf8" },
        }}
      >
        {dict.navbar.signIn}
      </Button>
      <Button
        variant="contained"
        component={Link}
        href={`/${lang}${getLocalizedPath("/auth/sign-up", lang)}`}
        sx={{
          textTransform: "none",
          fontWeight: 700,
          px: 4,
          height: 40,
          borderRadius: "999px",
          background: "linear-gradient(135deg, #22d3ee, #2563eb)",
          boxShadow: "0 12px 30px rgba(37, 99, 235, 0.35)",
          "&:hover": {
            background: "linear-gradient(135deg, #0ea5e9, #1d4ed8)",
            transform: "scale(1.02)",
          },
          transition: "all 0.2s",
        }}
      >
        {dict.navbar.startPro}
      </Button>
    </Stack>
  );
}
