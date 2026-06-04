import { request } from "./api";

export type ContactPayload = {
  first_name: string;
  last_name: string;
  email: string;
  subject: string;
  message: string;
};

export function sendContact(payload: ContactPayload) {
  return request("/contact/", {
    method: "POST",
    data: payload,
  });
}
