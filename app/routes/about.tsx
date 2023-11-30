import { } from "@remix-run/react";
import { FunctionComponent, useEffect } from "react";

export default function About() {
  return (
    <div id="about">
      <h1>Hello from about page</h1>
      <Content name="Van Allfred" />
    </div>
  )
}

const Content = (props: any) => {
  useEffect(() => {
    console.log('test')
  }, [])
  return (
    <div>
      <h1>{props.name}</h1>
    </div>
  )
}