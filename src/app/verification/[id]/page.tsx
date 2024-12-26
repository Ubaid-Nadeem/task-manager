"use client";

import { setCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./verify.css";

export default function Verification({ params }: any) {
  const [loading, setLoading] = useState(false);
  const [completeReq, setCompleteReq] = useState(false);
  const [resMsg, setResMsg] = useState("");
  const route = useRouter();
  
  
  useEffect(() => {
    sendVerification();
  }, []);

  async function sendVerification() {
    setLoading(true);
    const param = await params;

    fetch(`${process.env.NEXT_PUBLIC_API}/verify/${param.id}`, {
      method: "GET",
      redirect: "follow",
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.error != true) {
          setCookie("authToken", result.data.user.token);
          setCompleteReq(true);
          setResMsg(result.msg);
          setTimeout(() => {
            localStorage.removeItem("pendingVerification");
            route.push("/tasks");
          }, 5000);
        } else {
          setResMsg(result.msg);
          setCompleteReq(true);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }

  return (
    <div className="flex items-center w-full h-screen flex-col justify-center">
      <h2 className="font-bold py-8 text-[22px] text-[gray]">TASK MANAGER</h2>
      <p className="pb-6">Verifing Your Email....</p>
      <div className="card">
        {completeReq ? (
          <p className="text-white">{resMsg}</p>
        ) : (
          <div className="loader">
            <p>loading</p>
            <div className="words">
              <span className="word"></span>
              <span className="word">Verifing</span>
              <span className="word">your</span>
              <span className="word">email</span>
              <span className="word">please wait..</span>
              <span className="word"></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
