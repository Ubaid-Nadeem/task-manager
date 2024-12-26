import { div } from "framer-motion/client";
import "./skeleton.css";
export default function Skeleton() {
  return (
    <div className="skeletoncard ">
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
      <div className="card__content p-3">
        <div className="flex w-52 flex-col gap-4">
          <div className="skeleton h-4 w-28"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
        </div>
      </div>
    </div>
  );

  //     <div className="card">

  //     <div className="card_load_extreme_title"></div>
  //     <div className="card_load_extreme_descripion"></div>
  // </div>
}
