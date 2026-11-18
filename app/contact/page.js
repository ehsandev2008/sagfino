import ContactHero from "@/components/contact/ContactHero";
import ContactMap from "@/components/contact/ContactMap";

export const metadata = {
  title: "تماس با ما | سقفینو",
  description:
    "برای دریافت راهنمایی و پشتیبانی درباره خدمات سقفینو با ما در ارتباط باشید.",
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactMap />
    </>
  );
}
