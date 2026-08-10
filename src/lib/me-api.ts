import { api } from "./api";

export type MeInquiry = {
  id: string;
  propertyId: string;
  propertySlug: string;
  propertyTitle: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  status?: string;
};

export const meApi = {
  inquiries: (token: string) =>
    api<{ success: boolean; data: MeInquiry[] }>("/me/inquiries", { token }),

  viewed: (propertyId: string, token: string) =>
    api<{ success: boolean; data: { propertyId: string } }>("/me/viewed", {
      method: "POST",
      body: { propertyId },
      token,
    }),
};
