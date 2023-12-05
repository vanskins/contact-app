import {
  Form,
  Links,
  Link,
  NavLink,
  LiveReload,
  Meta,
  Scripts,
  ScrollRestoration,
  Outlet,
  useLoaderData,
  useNavigation,
  useSubmit
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useEffect } from "react";
import { authenticator } from "~/utils/auth.server";

import appStylesHref from "./app.css";
import { getContacts, createEmptyContact } from "./data";


export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
];


export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  switch (intent) {
    case "logout": {
      return authenticator.logout(request, { redirectTo: '/' })
    }
    case "new": {
      const contact = await createEmptyContact();
      return redirect(`/contacts/${contact.id}/edit`);
    }
    default: {
      throw new Error("Unexpected action");
    }
  }
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  const user = await authenticator.isAuthenticated(request)

  return json({ contacts, q, user });
};

export default function App() {
  const { contacts, q, user } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const submit = useSubmit();

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has(
      "q"
    );

  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {
          user &&
          <div id="sidebar">
            <div>
              <Link to="/">
                <h1>Welcome {user.username}</h1>
              </Link>
              <Form method="post">
                <button name="intent" value="logout" type="submit">
                  <p>Logout</p>
                </button>
              </Form>
            </div>
            <div>
              <Form
                id="search-form"
                role="search"
                onChange={(event) => {
                  const isFirstSearch = q === null;
                  submit(event.currentTarget, {
                    replace: !isFirstSearch,
                  });
                }}
              >
                <input
                  id="q"
                  className={searching ? "loading" : ""}
                  aria-label="Search contacts"
                  defaultValue={q || ""}
                  placeholder="Search"
                  type="search"
                  name="q"
                />
                <div id="search-spinner" hidden={!searching} aria-hidden />
              </Form>
              <Form method="post">
                <button name="intent" value="new" type="submit">New</button>
              </Form>
            </div>
            <nav>
              {contacts.length ? (
                <ul>
                  {contacts.map((contact) => (
                    <li key={contact.id}>
                      <NavLink
                        className={({ isActive, isPending }) =>
                          isActive
                            ? "active"
                            : isPending
                              ? "pending"
                              : ""
                        }
                        to={`contacts/${contact.id}`}
                      >
                        {contact.first || contact.last ? (
                          <>
                            {contact.first} {contact.last}
                          </>
                        ) : (
                          <i>No Name</i>
                        )}{" "}
                        {contact.favorite ? (
                          <span>★</span>
                        ) : null}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>
                  <i>No contacts</i>
                </p>
              )}
            </nav>
          </div>
        }
        <div
          className={
            navigation.state === "loading" && !searching ? "loading" : ""
          }
          id="detail"
        >
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
