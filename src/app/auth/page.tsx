"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormEvent } from "react";
import { setCookie } from "cookies-next";
import { notification } from "antd";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [api, contextHolder] = notification.useNotification();
  const [authMethod, setAuthMethod] = useState("SignIn");
  const [name, setName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isError, setIsError] = useState(false);

  const route = useRouter();

  const openNotification = (pauseOnHover: boolean, message: string) => () => {
    api.open({
      message: `Error`,
      description: message,
      showProgress: true,
      pauseOnHover,
    });
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    setIsLoading(true);
    event.preventDefault();

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/user/login`, {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password,
      }),
      headers: myHeaders,
    });

    try {
      const data = await response.json();

      setIsLoading(false);

      if (data.error) {
        openNotification(true, data.msg)();
        // return;
      }

      if (data.data) {
        setCookie("authToken", data.data.token);
        route.push("/tasks");
      }
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  }
  async function SignUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
      name,
      email,
      password,
    });

    fetch(`${process.env.NEXT_PUBLIC_API}/user/signup`, {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    })
      .then((response) => response.json())
      .then((result) => {
        if (!result.error) {
          localStorage.setItem(
            "pendingVerification",
            JSON.stringify(result.data)
          );
          route.push("/verification");
          setName("");
          setEmail("");
          setPassword("");
          setErrorMsg("");
          setIsError(false);
        } else {
          setIsError(true);
          setErrorMsg(result.msg);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  }

  function updateStates() {
    setEmail("");
    setPassword("");
    setPassword("");
  }

  return (
    <>
      {contextHolder}

      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-20 w-auto"
            src="https://www.asistbt.co.uk/wp-content/uploads/2021/06/taskmanager-600x264.png"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            {authMethod == "SignIn"
              ? "Sign in to your account"
              : "Welcome to Task Manager"}
          </h2>
        </div>

        {authMethod == "SignIn" ? (
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={onSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Password
                  </label>
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    name="password"
                    id="password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
              <div>
                <button
                  disabled={isLoading}
                  type="submit"
                  className="btn flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {isLoading ? "Loading...." : "Sign in"}
                </button>
              </div>
            </form>
            <p className="text-center text-[15px] py-4">
              Dont have an account?{" "}
              <span
                className="cursor-pointer	underline text-indigo-600"
                onClick={() => {
                  setAuthMethod("SignUp");
                  updateStates()
                }}
              >
                Sign up here
              </span>
            </p>
          </div>
        ) : (
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={SignUp}>
              {isError && (
                <div className="text-white bg-[#EA425C] p-3 text-[14px]">
                  {" "}
                  {errorMsg}
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Name
                </label>
                <div className="mt-2">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="name"
                    name="name"
                    id="name"
                    required
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    name="password"
                    id="password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>

              <div>
                <button
                  disabled={isLoading}
                  type="submit"
                  className="btn flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {isLoading ? "Loading...." : "Sign Up"}
                </button>
              </div>
            </form>
            <p className="text-center text-[15px] py-4">
              Already have an account?{" "}
              <span
                className="cursor-pointer	underline text-indigo-600"
                onClick={() => {
                  setAuthMethod("SignIn");
                  updateStates()
                }}
              >
                Login here
              </span>
            </p>
          </div>
        )}
      </div>
    </>
  );
}
