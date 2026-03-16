// app/page.tsx

import { cookies } from "next/headers";
import HomePage from "@/components/Homepage";

export default async function Page() {
  const cookie =  await cookies();
  const token = cookie.get("token");

  console.log("token is ",token);
  const loggedIn = !!token;
  console.log("loggedIN ",loggedIn);

  return <HomePage loggedIn={loggedIn} />;
}