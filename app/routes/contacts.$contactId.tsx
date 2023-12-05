import { useLoaderData } from "@remix-run/react";
import { json, ActionFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getContact, updateContact } from "../data";

import type { LoaderFunctionArgs } from "@remix-run/node";
import ContactCards from "~/components/ContactCards";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ contact });
};

export const action = async ({
  params,
  request,
}: ActionFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const formData = await request.formData();
  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
  });
};

export default function Contact() {
  const { contact } = useLoaderData<typeof loader>();

  return (
    <ContactCards contact={contact} />
  );
}
