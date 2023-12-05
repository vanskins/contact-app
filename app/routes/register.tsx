import { Form } from '@remix-run/react'
import { authenticator } from "~/utils/auth.server";
import { createUser } from "~/utils/user.server"

import type { LoaderFunctionArgs, LoaderFunction, ActionFunctionArgs, MetaFunction } from "@remix-run/node";

export const action = async (props: ActionFunctionArgs) => {
  const { request } = props;
  const formData = await request.formData();
  const newUser: any = Object.fromEntries(formData);

  await createUser(newUser)


  return await authenticator.authenticate("form", request, {
    successRedirect: "/",
    failureRedirect: "/register",
    context: { formData },
  })

};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  })
  return user
}

const Register = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <p id="index-page">
        Remix Contact APP
        <br />
        Create a new account
      </p>
      <div className="w-full lg:w-2/5 mx-15 p-5 shadow-lg">
        <Form className="" method="post">
          <div>
            <label className="block mb-2 font-medium" htmlFor="username">Username</label>
            <input
              className="w-full p-2 mb-6 border-2 rounded-lg border-gray-400 outline-none focus:border-blue-300"
              aria-label="username"
              name="username"
              type="text"
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium" htmlFor="email">Password</label>
            <input
              className="w-full p-2 mb-6 border-2 rounded-lg border-gray-400 outline-none focus:border-blue-300"
              aria-label="password"
              name="password"
              placeholder="Password"
              type="password"
            />
          </div>
          <div className="flex flex-row justify-end">
            <button
              name="login"
              className="bg-green-400 text-white font-medium p-2 rounded-md w-20 m-2"
              type="submit"
            >
              Sign up
            </button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default Register