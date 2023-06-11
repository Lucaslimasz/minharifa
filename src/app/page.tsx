"use client";

import AddRaffle from "@/components/addRaffle";
import { useAuthGoogle } from "@/hooks/useAuthGoogle";
import { useRaffles } from "@/hooks/useRaffles";
import Image from "next/image";
import { useEffect, useState } from "react";

interface IData {
  name: string;
  number: string;
}

export default function Home() {
  const [data, setData] = useState<IData[]>([]);
  const { rafflesActives } = useRaffles();
  const { isUserValid } = useAuthGoogle();
  const [selectedNumber, setSelectedNumber] = useState<string>("");

  const numbers = rafflesActives.map((item) => {
    const matchingItem = data.find((d) => d.number === item.number);
    return matchingItem ? matchingItem.number : null;
  });

  useEffect(() => {
    const obj = [];
    for (let i = 1; i <= 300; i++) {
      const number = i.toString().padStart(2, "0");
      obj.push({
        name: "",
        number: number,
      });
    }

    setData(obj);
  }, []);

  const handleSelectedNumber = (number: string) => {
    setSelectedNumber(number);
  };

  return (
    <main className="flex min-h-screen flex-col items-center px-2 md:px-5 py-10 md:p-10">
      <div className="md:flex items-center gap-4">
        <div className="">
          <Image
            src="/perfil.png"
            alt="Eifol"
            width={180}
            height={180}
            className="m-auto mb-4"
          />
          <Image
            className="m-auto py-4"
            src="/eifol.png"
            alt="Eifol"
            width={100}
            height={100}
          />
        </div>
        <div className="flex flex-col items-center max-w-lg">
          <p className="text-center text-sm max-w-xl md:text-lg">
            Olá, Somos Lucas & Alane e iremos para o EIFOL no mês de Julho.
            Queremos que você nos ajude a estar presente naquele lugar!!!
            Contamos com a sua sua ajuda.
          </p>
          <p className="text-lg pt-4 max-w-xl">
            <b>Valor: R$ 10,00</b> | <b>Prêmio: R$ 100,00</b>
          </p>
          <p className="text-base pt-4 max-w-xl">PIX: 83 989050001</p>
        </div>
      </div>
      <p className="text-base pt-4 max-w-xl">
        O sorteio será 02/07 no instagram: @lucaslimasz_
      </p>
      <section className="my-10 bg-white border-2 border-[#174580]">
        <div className="flex justify-center flex-wrap max-w-4xl text-slate-950">
          {data.map((item) => {
            const alredyBought = numbers.includes(item.number);
            return (
              <button
                className={`flex-1 w-10 flex items-center justify-center 
                p-1 border md:p-2 md:border-2 border-[#174580]
                ${alredyBought && "text-xl"}
              `}
                key={item.number}
                onClick={() => handleSelectedNumber(item.number)}
                disabled={alredyBought || !isUserValid}
              >
                {alredyBought ? "❤️" : item.number}
              </button>
            );
          })}
        </div>
      </section>

      {selectedNumber && (
        <AddRaffle
          number={selectedNumber}
          setSelectedNumber={setSelectedNumber}
        />
      )}
    </main>
  );
}
