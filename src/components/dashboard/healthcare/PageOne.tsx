import React from "react";

const tableData = [
  {
    id: 1,
    name: "Aishat Mudi",
    age: 28,
    genotype: "AB",
    numberOfCs: 2,
    numberOfChildren: 3,
    status: true,
  },
  {
    id: 2,
    name: "Olupitan Dami",
    age: 26,
    genotype: "AA",
    numberOfCs: 0,
    numberOfChildren: 1,
    status: false,
  },
];

const PageOne = () => {
  return (
    <section className="px-14 py-12">
      <div className="text-primarytext">
        <h1 className="text-4xl font-bold">
          Hello. <span className="font-normal"> Dayo!</span>
        </h1>
        <p className="text-xl mt-2 opacity-80">Good Morning</p>
      </div>
      <div>
        <table className="flex flex-col my-8 text-center text-base">
          <thead>
            <tr className="grid grid-cols-7 ">
              <th className="border p-4">S/N</th>
              <th className="border p-4">Name</th>
              <th className="border p-4">Age</th>
              <th className="border p-4">Genotype</th>
              <th className="border p-4">Number of CS</th>
              <th className="border p-4">Number of Children</th>
              <th className="border p-4">Alert Status</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((data) => {
              const {
                id,
                name,
                age,
                genotype,
                numberOfCs,
                numberOfChildren,
                status,
              } = data;
              return (
                <tr key={id} className="grid grid-cols-7">
                  <td className="border p-4">{id}</td>
                  <td className="border p-4">{name}</td>
                  <td className="border p-4">{age}</td>
                  <td className="border p-4">{genotype}</td>
                  <td className="border p-4">{numberOfCs}</td>
                  <td className="border p-4">{numberOfChildren}</td>
                  <td className="border p-4">
                    <input type="radio" checked={status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
export default PageOne;
