import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { LoaderFunction, ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";
import invariant from "tiny-invariant";
import { getContactsByfavorite, updateContact } from "../data";
import ContactCards from "~/components/ContactCards";

export const action = async (props: ActionFunctionArgs) => {
  const { request, params } = props;
  const formData = await request.formData();

  invariant(params.contactId, "Missing contactId param");

  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })
  const contacts = await getContactsByfavorite();

  return json({ contacts, user });
}

export default function Index() {
  const { contacts } = useLoaderData<typeof loader>();

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <p id="index-page" />
      <br />
      {contacts.length === 0 ?
        <p className="text-3xl font-bold text-left mb-10">No contacts added on favorite lists.</p>
        :
        <p className="text-3xl font-bold text-left mb-10">These are the list of your favorite contacts.</p>
      }
      <div className="w-full overflow-auto">
        {contacts.map((i: any, k: number) => {
          return (
            <div key={k} className="my-4">
              <ContactCards contact={i} viewOnly />
            </div>
          )
        })}
      </div>
    </div>
  );
}
