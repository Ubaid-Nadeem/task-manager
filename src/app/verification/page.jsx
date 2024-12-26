"use client";
import { useEffect, useRef, useState } from "react";
import "./verification.css";
import Loader from "@/ReuseComponent/loader/loader";
import { useRouter } from "next/navigation";
import { getCookie, setCookie } from "cookies-next";

export default function () {
  const [countDown, setCountDown] = useState("00");
  const [reSend, setResend] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [token, setToken] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const route = useRouter();
  const btnRef = useRef(null);

  useEffect(() => {
    let token = getCookie("authToken");
    let pendingUser = localStorage.getItem("pendingVerification");

    if (pendingUser) {
      pendingUser = JSON.parse(pendingUser);
      setEmail(pendingUser?.user.email );
      setName(pendingUser?.user.name);
      setToken(pendingUser?.token);

      checkingUserVerified(pendingUser?.user.email);
    } else if (token != "null") {
      route.push("/tasks");
    }
  }, []);

  function Timer() {
    setResend(true);
    let a = 15;

    let timer = setInterval(() => {
      if (a == 0) {
        setResend(false);
        return clearInterval(timer);
      }

      a = a - 1;
      if (a < 10) {
        a = "0" + a;
      }
      setCountDown(a);
    }, 1000);
  }

  async function reSendEmail() {
    if (email && name && token) {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      var raw = JSON.stringify({
        name,
        email,
        token,
      });

      fetch(`${process.env.NEXT_PUBLIC_API}/user/resendemail`, {
        method: "POST",
        redirect: "follow",
        headers: myHeaders,
        body: raw,
      })
        .then((response) => response.json())
        .then((result) => {
          if (!result.error) {
            btnRef.current?.click();
            Timer();
            setResend(true);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  async function checkingUserVerified(email) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      email: { email },
    });

    fetch(`${process.env.NEXT_PUBLIC_API}/user/getuser`, {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.data.isVerified) {
          localStorage.removeItem("pendingVerification");
          route.push("/tasks");
        } else {
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.log("error", error);
        setIsLoading(false);
      });
  }

  return isLoading ? (
    <Loader />
  ) : (
    <>
      <div>
        <input type="checkbox" id="my_modal_7" className="modal-toggle" />
        <div className="modal" role="dialog">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Email Sent Successfully!</h3>
            <p className="py-4">
              Check your inbox and spam folder and verify your email.
            </p>
          </div>
          <label className="modal-backdrop" htmlFor="my_modal_7">
            Close
          </label>
        </div>
      </div>

      <div className="flex items-center h-screen w-full justify-center flex-col">
        <label
          htmlFor="my_modal_7"
          className="btn bg-inherit border-none shadow-none cursor-default hover:bg-inherit"
          ref={btnRef}
        ></label>

        <h2 className="font-bold py-8 text-[gray] text-[24px]">TASK MANAGER</h2>

        <div className="email_card">
          <svg
            className="wave"
            viewBox="0 0 1440 320"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,256L11.4,240C22.9,224,46,192,69,192C91.4,192,114,224,137,234.7C160,245,183,235,206,213.3C228.6,192,251,160,274,149.3C297.1,139,320,149,343,181.3C365.7,213,389,267,411,282.7C434.3,299,457,277,480,250.7C502.9,224,526,192,549,181.3C571.4,171,594,181,617,208C640,235,663,277,686,256C708.6,235,731,149,754,122.7C777.1,96,800,128,823,165.3C845.7,203,869,245,891,224C914.3,203,937,117,960,112C982.9,107,1006,181,1029,197.3C1051.4,213,1074,171,1097,144C1120,117,1143,107,1166,133.3C1188.6,160,1211,224,1234,218.7C1257.1,213,1280,139,1303,133.3C1325.7,128,1349,192,1371,192C1394.3,192,1417,128,1429,96L1440,64L1440,320L1428.6,320C1417.1,320,1394,320,1371,320C1348.6,320,1326,320,1303,320C1280,320,1257,320,1234,320C1211.4,320,1189,320,1166,320C1142.9,320,1120,320,1097,320C1074.3,320,1051,320,1029,320C1005.7,320,983,320,960,320C937.1,320,914,320,891,320C868.6,320,846,320,823,320C800,320,777,320,754,320C731.4,320,709,320,686,320C662.9,320,640,320,617,320C594.3,320,571,320,549,320C525.7,320,503,320,480,320C457.1,320,434,320,411,320C388.6,320,366,320,343,320C320,320,297,320,274,320C251.4,320,229,320,206,320C182.9,320,160,320,137,320C114.3,320,91,320,69,320C45.7,320,23,320,11,320L0,320Z"
              fillOpacity="1"
            ></path>
          </svg>

          <div className="icon-container">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              strokeWidth="0"
              fill="currentColor"
              stroke="currentColor"
              className="icon"
            >
              <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"></path>
            </svg>
          </div>
          <div className="message-text-container">
            <p className="message-text">Email sent</p>
            <p className="sub-text">Everything seems great</p>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 15 15"
            strokeWidth="0"
            fill="none"
            stroke="currentColor"
            className="cross-icon"
          >
            <path
              fill="currentColor"
              d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
              clipRule="evenodd"
              fillRule="evenodd"
            ></path>
          </svg>
        </div>
        <p
          className="text-center text-[gray] text-[14px] pt-10 px-5"
          style={{
            width: "400px",
            maxWidth: "100%",
          }}
        >
          Email sent <span className="font-bold">{email} </span> , Check your
          inbox and spam folder if you didnt receive an email you can get again
          through Resend Button
        </p>
        <div>
          <p className="text-center pt-5 font-bold">Time out : {countDown} </p>

          <button
            onClick={() => {
              setCookie("authToken", null);
              localStorage.removeItem("pendingVerification");
              route.push("/auth");
            }}
            type="button"
            className="font-bold my-8 text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br    dark:focus:ring-lime-800 font-medium rounded-lg text-sm px-5 py-3.5 text-center me-2 mb-2"
          >
            Log out
            {/* Time out : {countDown} */}
          </button>

          <button
            className="btn btn-primary "
            disabled={reSend}
            onClick={reSendEmail}
          >
            Resend email
          </button>
        </div>
      </div>
    </>
  );
}
