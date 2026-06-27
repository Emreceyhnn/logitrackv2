"use client";

import ApiRoundedIcon from "@mui/icons-material/ApiRounded";
import DataObjectRoundedIcon from "@mui/icons-material/DataObjectRounded";
import TerminalRoundedIcon from "@mui/icons-material/TerminalRounded";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import FooterPageLayout from "@/app/components/landing/FooterPageLayout";

export default function CustomApiClient() {
  const dict = useDictionary();
  const d = dict.landing.customApiPage;

  return (
    <FooterPageLayout
      badge={d.hero.badge}
      title={d.hero.title}
      subtitle={d.hero.subtitle}
      cards={[
        {
          icon: <ApiRoundedIcon sx={{ fontSize: 40, color: "#38bdf8" }} />,
          title: d.sections.dedicated.title,
          description: d.sections.dedicated.description,
        },
        {
          icon: <DataObjectRoundedIcon sx={{ fontSize: 40, color: "#a855f7" }} />,
          title: d.sections.integration.title,
          description: d.sections.integration.description,
        },
        {
          icon: <TerminalRoundedIcon sx={{ fontSize: 40, color: "#22d3ee" }} />,
          title: d.sections.support.title,
          description: d.sections.support.description,
        },
      ]}
      detail={{
        overline: d.detail.overline,
        title: d.detail.title,
        description: d.detail.description,
      }}
      ctaTitle={d.cta.title}
      ctaSubtitle={d.cta.subtitle}
      ctaIcon={<ApiRoundedIcon sx={{ fontSize: 40, color: "#38bdf8" }} />}
      copyright={d.footer.copyright.replace("{year}", new Date().getFullYear().toString())}
    />
  );
}
