export const contactEmail = "jhonreyc2002@gmail.com";

export const projectInquiryHref =
  "mailto:jhonreyc2002@gmail.com?subject=Project%20inquiry%20for%20JRC%20Techworks";

// Webmail drafts work even on devices without a configured mailto handler.
// Visitors still review and send the message themselves.
const inquirySubject = encodeURIComponent("Project inquiry for JRC Techworks");
export const gmailComposeHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(contactEmail)}&su=${inquirySubject}`;
export const outlookComposeHref = `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(contactEmail)}&subject=${inquirySubject}`;

export const socialLinks = [
  {
    label: "Facebook",
    detail: "Studio updates & messages",
    href: "https://www.facebook.com/profile.php?id=61596300089989",
    monogram: "f",
  },
  {
    label: "GitHub",
    detail: "Code & repositories",
    href: "https://github.com/jhonny8765",
    monogram: "</>",
  },
  {
    label: "LinkedIn",
    detail: "Professional network",
    href: "https://www.linkedin.com/in/jhon-rey-consolacion-926078337/",
    monogram: "in",
  },
] as const;
