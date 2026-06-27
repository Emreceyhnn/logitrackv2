"use client";

import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import GpsFixedRoundedIcon from "@mui/icons-material/GpsFixedRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import FooterPageLayout from "@/app/components/landing/FooterPageLayout";

export default function GlobalTrackingClient() {
  const dict = useDictionary();
  const d = dict.landing.globalTrackingPage;

  return (
    <FooterPageLayout
      badge={d.hero.badge}
      title={d.hero.title}
      subtitle={d.hero.subtitle}
      stats={[
        { value: d.stats.countries, label: d.stats.countriesLabel },
        { value: d.stats.updates, label: d.stats.updatesLabel },
        { value: d.stats.uptime, label: d.stats.uptimeLabel },
        { value: d.stats.events, label: d.stats.eventsLabel },
      ]}
      cards={[
        {
          icon: <PublicRoundedIcon sx={{ fontSize: 40, color: "#38bdf8" }} />,
          title: d.sections.liveMap.title,
          description: d.sections.liveMap.description,
        },
        {
          icon: <GpsFixedRoundedIcon sx={{ fontSize: 40, color: "#a855f7" }} />,
          title: d.sections.multiModal.title,
          description: d.sections.multiModal.description,
        },
        {
          icon: <NotificationsActiveRoundedIcon sx={{ fontSize: 40, color: "#22d3ee" }} />,
          title: d.sections.alerts.title,
          description: d.sections.alerts.description,
        },
      ]}
      ctaTitle={d.cta.title}
      ctaSubtitle={d.cta.subtitle}
      ctaIcon={<PublicRoundedIcon sx={{ fontSize: 40, color: "#38bdf8" }} />}
      copyright={d.footer.copyright.replace("{year}", new Date().getFullYear().toString())}
    />
  );
}
