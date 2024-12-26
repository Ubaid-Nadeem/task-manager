"use client";

import { useEffect, useState } from "react";
import pen from "../../../public/pen.svg";
import Image from "next/image";
import { tr } from "framer-motion/client";
import { useTaskContext } from "@/context/context";
import { useRef } from "react";
import { getCookie } from "cookies-next";
export default function ActionButton() {
  const [taskValue, setTaskValue] = useState("");
  const [addBtn, setAddBtn] = useState(true);
  const [isPending, setIsPending] = useState(false);

  const { task, setTask } = useTaskContext();
  const btnRef = useRef(null);

  async function addTask() {
    setIsPending(true);
    setAddBtn(true);

    const getToken = getCookie("authToken");
    if (getToken != "null" && getToken) {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${getToken}`);
      myHeaders.append("Content-Type", "application/json");
      // myHeaders.append("", "");

      var raw = JSON.stringify({
        task: taskValue,
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(`${process.env.NEXT_PUBLIC_API}/task`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (!result.error) {
            let taskClone = [...task];
            taskClone.unshift(result.data);
            setTask(taskClone);
            setTaskValue("");
            btnRef.current?.click();
            setIsPending(false)
            
          }
        })
        .catch((error) => console.log("error", error));
    }
    // btnRef.current?.click();
  }

  return (
    <div>
      <button className="z-50 cursor-pointer fixed bottom-5 right-6 bg-[#008cbf] rounded-full p-3 transition-all hover:p-4 hover:drop-shadow-md">
        <label htmlFor="my_modal_6">
          <Image width={30} src={pen} alt="" className="cursor-pointer" />
        </label>
      </button>

      <input type="checkbox" id="my_modal_6" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold py-3">New Task</h3>
          <textarea
            placeholder="Enter a Task"
            className="textarea textarea-bordered textarea-md w-full "
            value={taskValue}
            onChange={(e) => {
              setTaskValue(e.target.value);
              if (e.target.value.length >= 1) {
                setAddBtn(false);
              } else {
                setAddBtn(true);
              }
            }}
          ></textarea>

          <div className="modal-action">
            <label htmlFor="my_modal_6" className="btn" ref={btnRef}>
              Cancel
            </label>
            <button
              className="btn btn-primary"
              disabled={addBtn}
              onClick={addTask}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner"></span>
                  loading
                </>
              ) : (
                "Add New Task"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
