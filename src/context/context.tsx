"use client";

import { createContext, useContext, useState } from "react";

type UserType = {
  email: string;
  isVerified: boolean;
  name: string;
  password: string;
  __v: boolean;
  _id: string;
};

type CreateTaskContextType = {
  task: any[];
  setTask: (e: any) => void;
  user: UserType | null;
  setUser: (e: any) => void;
};

export type taskType = {
  createdAt: string;
  createdBy: string;
  isComplete: boolean;
  task: string;
  updatedAt: string;
  __v: boolean;
  _id: string;
};

const CreateTaskContext = createContext<CreateTaskContextType | null>(null);

export function TaskContext({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [task, setTask] = useState<taskType[] | []>([]);
  const [user, setUser] = useState<UserType | null>(null);

  return (
    <CreateTaskContext.Provider value={{ task, setTask, user, setUser }}>
      {children}
    </CreateTaskContext.Provider>
  );
}

export const useTaskContext = () => useContext(CreateTaskContext);
