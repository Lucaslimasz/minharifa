"use client";

import { useAuthGoogle } from "@/hooks/useAuthGoogle";
import { useRaffles } from "@/hooks/useRaffles";
import { ChangeEvent, useState } from "react";

interface IAddRaffleProps {
  number: string;
  setSelectedNumber: (number: string) => void;
}

interface IBuyer {
  name: string;
  contact: string;
}

export default function AddRaffle({ number, setSelectedNumber }: IAddRaffleProps) {
  const [user, setUser] = useState<IBuyer>({} as IBuyer);
  const { isUserValid } = useAuthGoogle();
  const { createRaffle } = useRaffles();

  const handleUser = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const onSubmit = () => {
    if(isUserValid){
      return;
    }
    const newUser = {...user, number}
    createRaffle(newUser)
    setSelectedNumber("")
  }

  return (
    <div className="fixed bg-slate-900 w-full h-screen top-0 flex items-center justify-center">
      <div className="flex flex-col gap-2 items-center w-96">
        <h1 className="text-6xl mb-5">{number}</h1>
        <input
          className="py-2 px-4 w-full text-slate-900"
          placeholder="Nome"
          name="name"
          onChange={handleUser}
        />
        <input
          className="py-2 px-4 w-full text-slate-900"
          placeholder="Contato"
          name="contact"
          onChange={handleUser}
        />
        <button
          className="mt-8 bg-slate-50 text-slate-950 font-semibold py-2 px-6 rounded-md"
          onClick={onSubmit}
        >
          Comprar
        </button>

        <button
          className="mt-8 bg-orange-700 text-slate-950 font-semibold py-2 px-6 rounded-md"
          onClick={() => setSelectedNumber('')}
        >
          Voltar
        </button>
      </div>
    </div>
  );
}
