import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { WhatsappIcon } from "./SocialIcons";
import SocialRow from "./SocialRow";
import { siteConfig, whatsappLink } from "@/data/site";
import { makeT, type Locale, type DictKey } from "@/lib/i18n";

const navKeys: { href: string; key: DictKey }[] = [
  { href: "/", key: "nav.home" },
  { href: "/evenements", key: "nav.events" },
  { href: "/combattants", key: "nav.fighters" },
  { href: "/galerie", key: "nav.gallery" },
  { href: "/videos", key: "nav.videos" },
  { href: "/actualites", key: "nav.news" },
  { href: "/aib", key: "nav.aib" },
  { href: "/partenaires", key: "nav.partners" },
];

export default function Footer({ locale }: { locale: Locale }) {
  const t = makeT(locale);
  return (
    <footer className="relative border-t border-line bg-carbon">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Marque */}
          <div>
            <div className="flex items-center gap-4">
              <Image
                src="/images/brand/logo-cdt.png"
                alt="Logo Choc des Titans"
                width={80}
                height={72}
                className="brand-logo h-16 w-auto object-contain"
              />
              <span className="dark-section inline-flex rounded-xl bg-[#0b0b0b] p-1.5 ring-1 ring-white/10">
                <Image
                  src="/images/brand/logo-aib-sm.png"
                  alt="Logo Association Ivoirienne de Boxe"
                  width={52}
                  height={52}
                  className="h-13 w-13 object-contain"
                />
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">{t("footer.brand")}</p>
            <div className="mt-5">
              <SocialRow />
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-display text-sm uppercase tracking-[0.2em] text-white/90">
              {t("footer.navigation")}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {navKeys.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted transition-colors hover:text-blue-light"
                  >
                    {t(l.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Compétition */}
          <div>
            <h3 className="font-display text-sm uppercase tracking-[0.2em] text-white/90">
              {t("footer.competition")}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/direct" className="text-muted transition-colors hover:text-blue-light">
                  {t("footer.watchLive")}
                </Link>
              </li>
              <li>
                <Link href="/evenements/cdt-7" className="text-muted transition-colors hover:text-blue-light">
                  {t("footer.currentEdition")}
                </Link>
              </li>
              <li>
                <Link href="/galerie" className="text-muted transition-colors hover:text-blue-light">
                  {t("footer.gallery")}
                </Link>
              </li>
              <li>
                <Link href="/aib/rejoindre" className="text-muted transition-colors hover:text-blue-light">
                  {t("footer.joinAib")}
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-muted transition-colors hover:text-blue-light">
                  {t("footer.admin")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-sm uppercase tracking-[0.2em] text-white/90">
              {t("footer.contact")}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 transition-colors hover:text-[#25d366]"
                >
                  <span className="text-[#25d366]"><WhatsappIcon size={15} /></span>
                  <span className="tabular">{siteConfig.contact.whatsapp}</span>
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="text-blue-light shrink-0" />
                {siteConfig.contact.email}
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="text-blue-light shrink-0" />
                {siteConfig.contact.phone}
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin size={15} className="text-blue-light shrink-0" />
                {siteConfig.contact.address}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 sm:flex-row">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Choc des Titans — JTS Group & AIB. {t("footer.rights")}
          </p>
          <p className="text-xs text-white/40">{t("common.demo")}</p>
        </div>
      </div>
    </footer>
  );
}
