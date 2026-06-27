"use client";

import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import TimerRoundedIcon from "@mui/icons-material/TimerRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import FooterPageLayout from "@/app/components/landing/FooterPageLayout";

export default function SlaClient() {
  const dict = useDictionary();
  const d = dict.landing.slaPage;

  return (
    <FooterPageLayout
      badge={d.hero.badge}
      title={d.hero.title}
      subtitle={d.hero.subtitle}
      cards={[
        {
          icon: <VerifiedRoundedIcon sx={{ fontSize: 40, color: "#38bdf8" }} />,
          title: d.sections.uptime.title,
          description: d.sections.uptime.description,
        },
        {
          icon: <TimerRoundedIcon sx={{ fontSize: 40, color: "#a855f7" }} />,
          title: d.sections.response.title,
          description: d.sections.response.description,
        },
        {
          icon: <AssessmentRoundedIcon sx={{ fontSize: 40, color: "#22d3ee" }} />,
          title: d.sections.transparency.title,
          description: d.sections.transparency.description,
        },
      ]}
      detail={{
        overline: d.detail.overline,
        title: d.detail.title,
        description: d.detail.description,
      }}
      ctaTitle={d.cta.title}
      ctaSubtitle={d.cta.subtitle}
      ctaIcon={<VerifiedRoundedIcon sx={{ fontSize: 40, color: "#38bdf8" }} />}
      copyright={d.footer.copyright.replace("{year}", new Date().getFullYear().toString())}
    />
  );
}
