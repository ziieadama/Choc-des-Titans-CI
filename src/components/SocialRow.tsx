import { siteConfig, whatsappLink } from "@/data/site";
import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
  TiktokIcon,
  WhatsappIcon,
} from "./SocialIcons";

/**
 * Rangée discrète de réseaux sociaux officiels, réutilisable partout
 * (menu mobile, articles, AIB, direct…).
 */
export default function SocialRow({
  size = "md",
  withWhatsapp = true,
  className = "",
}: {
  size?: "sm" | "md";
  withWhatsapp?: boolean;
  className?: string;
}) {
  const dims = size === "sm" ? "h-9 w-9" : "h-10 w-10";
  const links = [
    { icon: <FacebookIcon size={size === "sm" ? 15 : 17} />, href: siteConfig.socials.facebook, label: "Facebook", hover: "hover:bg-[#1877f2]" },
    { icon: <InstagramIcon size={size === "sm" ? 15 : 17} />, href: siteConfig.socials.instagram, label: "Instagram", hover: "hover:bg-[#d6249f]" },
    { icon: <TiktokIcon size={size === "sm" ? 15 : 17} />, href: siteConfig.socials.tiktok, label: "TikTok", hover: "hover:bg-[#0f151c]" },
    { icon: <YoutubeIcon size={size === "sm" ? 15 : 17} />, href: siteConfig.socials.youtube, label: "YouTube", hover: "hover:bg-[#ff0000]" },
    ...(withWhatsapp
      ? [{ icon: <WhatsappIcon size={size === "sm" ? 15 : 17} />, href: whatsappLink(), label: "WhatsApp officiel", hover: "hover:bg-[#25d366]" }]
      : []),
  ];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {links.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          title={s.label}
          className={`inline-flex ${dims} items-center justify-center rounded-md bg-white/5 text-white/60 transition-all duration-200 hover:text-white hover:-translate-y-0.5 ${s.hover}`}
        >
          {s.icon}
        </a>
      ))}
    </div>
  );
}
