"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/ReuseComponent/loader/loader";
import Card from "@/components/card/card.jsx";
import "./task.css";
import Skeleton from "@/components/cardSkeleton/skeleton";
import ActionButton from "@/components/actionbutton/actionbutton.jsx";
import { getCookie } from "cookies-next";
import { useTaskContext } from "@/context/context";

export default function Todos() {
  const [isloading, setIsloading] = useState(false);
  const [fetchTask, setFetchTask] = useState(false);
  const [userName, setUserName] = useState("");
  const [tasks, setTasks] = useState([]);
  const [errorDiv, setErrorDiv] = useState(false);
  const [isError, setIsError] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState("");

  const route = useRouter();
  const { task, setTask: setAllTask } = useTaskContext();

  useEffect(() => {
    const gettoken = getCookie("authToken");

    if (gettoken != "null" && gettoken) {
      getTasks(gettoken);
      setIsloading(true);
      getTimeOfDay();
    } else {
      route.push("/auth");
    }
  }, []);

  async function getTasks(token) {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    fetch(`${process.env.NEXT_PUBLIC_API}/task`, {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    })
      .then((response) => {
        setFetchTask(true);
        return response.json();
      })
      .then((result) => {
        if (result.data.user.isVerified) {
          setUserName(result.data.user.name);
          setTasks([...result.data.tasks]);
          setAllTask([...result.data.tasks]);
        } else {
          localStorage.setItem(
            "pendingVerification",
            JSON.stringify({ user: result.data.user, token: token })
          );
          route.push("/verification");
        }
      })
      .catch((error) => {
        setFetchTask(true);
        setErrorDiv(true);
        setIsError(true);
      });
  }

  function getTimeOfDay() {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      setTimeOfDay("Good Morning");
      return "Morning";
    } else if (currentHour >= 12 && currentHour < 18) {
      setTimeOfDay("Good Afternoon");
      return "Afternoon";
    } else {
      setTimeOfDay("Good Night");
      return "Night";
    }
  }

  return (
    <div>
      {!isloading ? (
        <div>
          <Loader />
        </div>
      ) : (
        <div className="p-4">
          <h1 className="text-3xl font-bold py-2">{timeOfDay}</h1>
          {isError ? (
            <div className="text-center">
              {" "}
              <p className="p-5 tracking-wider text-[14px]">Data Not Found</p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setIsError(false);
                  setFetchTask(false);

                  const gettoken = getCookie("authToken");

                  if (gettoken) getTasks(gettoken.toString());
                }}
              >
                Retry
              </button>
            </div>
          ) : (
            <div>
              {fetchTask ? (
                <h2 className="pb-3 tracking-wider uppercase">{userName}</h2>
              ) : (
                <div className="skeleton h-4 w-28 my-3"></div>
              )}

              {!fetchTask ? (
                <Skeleton />
              ) : (
                <div className="tasks-container flex gap-3 flex-wrap">
                  {task.length == 0 ? (
                    <div className="flex flex-col items-center w-[100%]">
                      <img
                        style={{
                          width: "300px",
                          maxWidth: "300px",
                        }}
                        src="https://www.edgecrm.app/images/no-data.gif"
                        alt="empty list"
                      />
                      <p className="tracking-widest">Empty List</p>
                    </div>
                  ) : (
                    task.map((value, id) => {
                      return (
                        <div key={id}>
                          <Card
                            id={id}
                            taskValue={value.task}
                            isComplete={value.isComplete}
                            updatedAt={value.updatedAt}
                            taskid={value._id}
                          />
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="error-container">
        <input
          checked={errorDiv}
          type="checkbox"
          id="my_modal_7"
          className="modal-toggle"
          onChange={() => {}}
        />
        <div className="modal" role="dialog">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Network Error!</h3>
            <p className="py-4">
              Please check your internet connection and retry
            </p>
          </div>
          <label
            className="modal-backdrop"
            htmlFor="my_modal_7"
            onClick={() => setErrorDiv(false)}
          >
            Close
          </label>
        </div>
      </div>

      {fetchTask && <ActionButton />}
    </div>
  );
}
