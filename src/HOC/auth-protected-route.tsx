"use client";

import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTaskContext } from "@/context/context";
import Loader from "@/ReuseComponent/loader/loader";

export default function AuthProtectedRoutes({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);
  const route = useRouter();
  const { user } = useTaskContext()!;

  useEffect(() => {
    let token = getCookie("authToken");

    let penddingUser = localStorage.getItem("pendingVerification");

    if (penddingUser && token) return route.push("/verification");
    else if (token != "null" && token != undefined) {
      route.push("/tasks");
    } else {
      setIsLoading(false);
    }
  }, [user]);

  return <>{isLoading ? <Loader /> : children}</>;
}
