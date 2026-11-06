import { contactEmail, projectInquiryHref, socialLinks } from "@/lib/contact";
import ArrowIcon from "@/components/arrow-icon";

const footerLinks = [
  { label: "Home", href: "/#top" },
  { label: "Selected work", href: "/#work" },
  { label: "Services", href: "/#services" },
  { label: "About the studio", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand-block">
            <a href="/#top" className="footer-logo" aria-label="JRC Techworks home">
              JRC<span>TECHWORKS</span>
            </a>
            <p>Thoughtful software for the way real businesses work.</p>
            <a className="footer-mail" href={projectInquiryHref}>{contactEmail}</a>
          </div>
          <nav className="footer-nav" aria-label="Footer navigation">
            <span className="footer-heading">EXPLORE</span>
            {footerLinks.map((link) => <a href={link.href} key={link.href}>{link.label}</a>)}
          </nav>
          <div className="footer-social">
            <span className="footer-heading">CONNECT</span>
            {socialLinks.map((link) => (
              <a href={link.href} key={link.label} target="_blank" rel="noopener noreferrer">
                {link.label}<ArrowIcon diagonal />
              </a>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} JRC Techworks</span>
          <span>TWO BUILDERS. ONE SHARED PURPOSE.</span>
          <a href="/#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
