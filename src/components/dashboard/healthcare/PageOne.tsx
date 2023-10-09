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
        <table className="flex flex-col gap-2 my-8 text-center text-base">
          <thead>
            <tr className="grid gap-2 grid-cols-7">
              <th>S/N</th>
              <th>Name</th>
              <th>Age</th>
              <th>Genotype</th>
              <th>Number of CS</th>
              <th>Number of Children</th>
              <th>Alert Status</th>
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
                <tr key={id} className="grid gap-2 grid-cols-7">
                  <td>{id}</td>
                  <td>{name}</td>
                  <td>{age}</td>
                  <td>{genotype}</td>
                  <td>{numberOfCs}</td>
                  <td>{numberOfChildren}</td>
                  <td>{status}</td>
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
