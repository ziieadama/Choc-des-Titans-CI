"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { whatsappLink, siteConfig } from "@/data/site";
import { WhatsappIcon } from "./SocialIcons";
import { useLocale } from "./LocaleProvider";

/**
 * Bouton WhatsApp flottant (contact officiel du Choc des Titans).
 * Discret : apparaît après un léger scroll, bulle d'info refermable.
 */
export default function WhatsAppFloat() {
  const { locale } = useLocale();
  const [visible, setVisible] = useState(false);
  const [bubble, setBubble] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    // Bulle d'invitation une seule fois par session
    const t = setTimeout(() => {
      if (!sessionStorage.getItem("cdt-wa-bubble")) {
        setBubble(true);
        sessionStorage.setItem("cdt-wa-bubble", "1");
        setTimeout(() => setBubble(false), 6000);
      }
    }, 4000);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(t);
    };
  }, []);

  const message =
    locale === "en"
      ? "Hello Choc des Titans! I'm contacting you from the website."
      : "Bonjour Choc des Titans ! Je vous contacte depuis le site web.";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ type: "spring", damping: 18, stiffness: 260 }}
          className="fixed bottom-5 right-5 z-[90] flex items-end gap-3"
        >
          <AnimatePresence>
            {bubble && (
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                className="glass relative max-w-[220px] rounded-xl rounded-br-sm p-3.5 shadow-card"
              >
                <button
                  onClick={() => setBubble(false)}
                  aria-label={locale === "en" ? "Close" : "Fermer"}
                  className="absolute -right-1.5 -top-1.5 inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white/60 backdrop-blur hover:text-white"
                >
                  <X size={12} />
                </button>
                <p className="text-xs leading-relaxed text-white/85">
                  {locale === "en"
                    ? "A question? Chat with the official Choc des Titans team."
                    : "Une question ? Écrivez à l'équipe officielle du Choc des Titans."}
                </p>
                <p className="tabular mt-1 text-[11px] font-bold text-[#25d366]">
                  {siteConfig.contact.whatsapp}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.a
            href={whatsappLink(message)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contacter le Choc des Titans sur WhatsApp"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_8px_30px_rgba(37,211,102,0.45)]"
          >
            <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25d366]/40 [animation-duration:2.5s]" />
            <WhatsappIcon size={26} />
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
