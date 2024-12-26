import { getCookie } from "cookies-next";
import "./card.css";
import { useEffect, useRef, useState } from "react";
import { useTaskContext } from "@/context/context";

export default function Card({ id, taskValue, isComplete, updatedAt, taskid }) {
  const [isCompleted, setIsCompleted] = useState();
  const [updateTaskValue, setUpdateTaskValue] = useState("");
  const [isPending, setIsPending] = useState(false);
  // const [isChanges, setIsChanges] = useState(true);
  const [updateStatus, setUpdateStatus] = useState(false);

  const closeBtn = useRef(null);
  const { task, setTask } = useTaskContext();

  const obj = {
    value: taskValue,
    status: isComplete,
  };

  function upadateTask(task, status) {
    setUpdateTaskValue(task);
    setIsCompleted(status);
  }

  function taskDayChecker() {
    let currentDate = new Date();
    let taskTime = new Date(`${`${updatedAt}`}`);

    if (taskTime.getDate() == currentDate.getDate()) {
      return "Today";
    } else if (currentDate.getDate() - taskTime.getDate() == 1) {
      return "Yesterday";
    } else {
      return `${currentDate.getDate() - taskTime.getDate()} days ago`;
    }
  }

  // function TaskChangesChecker() {
  //   if (updateTaskValue == obj.value && isCompleted == obj.status) {
  //     setIsChanges(true);
  //   } else {
  //     setIsChanges(false);
  //   }
  // }

  function DeleteTask() {
    setIsPending(true);
    const token = getCookie("authToken");

    if (token && token != "null") {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      fetch(`${process.env.NEXT_PUBLIC_API}/task/${taskid}`, {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow",
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.task) {
            let taskClone = [...task];
            let index;
            taskClone.forEach((value, id) => {
              if (value._id == result.task._id) {
                index = id;
              }
            });

            taskClone.splice(index, 1);
            setTask([...taskClone]);
          }
          setIsPending(false);
          ClosePopUp();
        })
        .catch((error) => {
          console.log("error", error);
          setIsPending(false);
        });
    }
  }

  function ClosePopUp() {
    closeBtn.current?.click();
  }

  async function updateTaskDB() {
    setUpdateStatus(true);
    const token = getCookie("authToken");

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      task: updateTaskValue,
      isComplete: isCompleted,
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${process.env.NEXT_PUBLIC_API}/task/${taskid}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setUpdateStatus(false);

        let taskClone = [...task];

        (taskClone[id].task = updateTaskValue),
          (taskClone[id].isComplete = isCompleted),
          setTask([...taskClone]);
        closeBtn.current.click();
      })
      .catch((error) => {
        console.log("error", error);
        setUpdateStatus(false);
      });
  }

  function ResetValue() {
    setIsCompleted(isComplete);
    setUpdateTaskValue(taskValue);
  }

  // useEffect(() => {
  //   TaskChangesChecker();
  //   console.log("running");
  // }, [isCompleted, updateTaskValue]);

  return (
    <div>
      <div className="task_card">
        <div className="tools">
          <div className="circle">
            <span className="red box"></span>
          </div>
          <div className="circle">
            <span className="yellow box"></span>
          </div>
          <div className="circle">
            <span className="green box"></span>
          </div>
        </div>

        <div className="card__content">
          <div className="flex justify-between p-3">
            <div>
              <h2 className="text-[16px] font-bold py-2">{taskValue}</h2>
              <p
                className="text-[14px] py-2"
                style={{
                  color: "gray",
                }}
              >
                {taskDayChecker()}
              </p>

              <p
                style={{
                  color: isComplete ? "#00cd5b" : "#ff524e",
                }}
              >
                {isComplete ? (
                  <span className="circle">
                    <span className="green box"></span>
                    <span className="pl-2 text-[13px]">Completed</span>
                  </span>
                ) : (
                  <span className="circle">
                    <span className="red box"></span>
                    <span className="pl-2 text-[13px]">Incomplete</span>
                  </span>
                )}
              </p>
            </div>
            <div>
              <label
                htmlFor={`my_modal_${id}`}
                className="cursor-pointer p-2"
                onClick={() => {
                  upadateTask(taskValue, isComplete);
                }}
              >
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block h-5 w-5 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                  ></path>
                </svg>
              </label>
            </div>
          </div>
        </div>
      </div>
      {/* Edit Modal */}

      <div>
        <input type="checkbox" id={`my_modal_${id}`} className="modal-toggle" />
        <div className="modal" role="dialog">
          <div className="modal-box">
            <h2 className="py-2 font-bold">Task </h2>
            <textarea
              className="textarea textarea-bordered w-full"
              value={updateTaskValue}
              onChange={(e) => setUpdateTaskValue(e.target.value)}
            ></textarea>

            <div className="form-control">
              <label className="cursor-pointer label">
                <span className="label-text">Task Completed</span>
                <input
                  type="checkbox"
                  defaultChecked={isComplete}
                  className="checkbox checkbox-accent"
                  onChange={(e) => {
                    setIsCompleted(e.target.checked);
                  }}
                />
              </label>
            </div>

            <button
              className="btn btn-outline btn-error mt-5"
              disabled={isPending}
              onClick={DeleteTask}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner"></span>
                  loading
                </>
              ) : (
                "Delete Task"
              )}
            </button>

            <div className="modal-action">
              <label
                htmlFor={`my_modal_${id}`}
                className="btn"
                ref={closeBtn}
                onClick={ResetValue}
              >
                Cancel
              </label>
              <button
                className="btn btn-primary"
                // disabled={isChanges}
                onClick={() => {
                  updateTaskDB(taskid);
                }}
              >
                {updateStatus ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    loading
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
