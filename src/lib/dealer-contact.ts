import { GROWRA_CONTACT } from "@/constants";

/** Always Growra Realty — never owner or agent numbers. */
export function getDealerPhone(): {
  display: string;
  tel: string;
  masked: string;
  email: string;
  dealerName: string;
} {
  const digits = GROWRA_CONTACT.phoneDisplay.replace(/\D/g, "").slice(-10);
  return {
    display: GROWRA_CONTACT.phoneDisplay,
    tel: GROWRA_CONTACT.phoneTel,
    masked: `+91 ${digits.slice(0, 2)}XXX XX${digits.slice(-2)}`,
    email: GROWRA_CONTACT.email,
    dealerName: GROWRA_CONTACT.name,
  };
}
