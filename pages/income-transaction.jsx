import React, { useEffect, useState } from "react";
import Layout from "../components/layout";
import { API } from "./api/api";
import RP from "rupiah-format";

export default function IncomeTransaction() {
  const [income, setIncome] = useState();
  console.log(income);

  useEffect(() => {
    const getIncome = async (e) => {
      const response = await API.get("/incomes");
      setIncome(response.data.data);
    };
    getIncome();
  }, []);

  return (
    <Layout pageTitle='Income Transaction'>
      {income == "" ? (
        <div className='flex justify-center mt-5'>
          <img src='/empty.png' alt='no transaction' width={750} />
        </div>
      ) : (
        <>
          <div className='md:px-40 md:py-10'>
            <p className='font-bold text-4xl mb-10 font-header'>
              Income Transaction
            </p>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm text-left text-gray-500'>
                <thead className='text-md text-gray-700 bg-gray-100'>
                  <tr>
                    <th scope='col' className='py-3 px-6'>
                      No
                    </th>
                    <th scope='col' className='py-3 px-6'>
                      Name
                    </th>
                    <th scope='col' className='py-3 px-6'>
                      Address
                    </th>
                    <th scope='col' className='py-3 px-6'>
                      Products Order
                    </th>
                    <th scope='col' className='py-3 px-6'>
                      Total
                    </th>
                    <th scope='col' className='py-3 px-6'>
                      Status
                    </th>
                  </tr>
                </thead>
                {income?.map((item, index) => (
                  <tbody key={item.id}>
                    <tr className='border-b bg-white'>
                      <td className='py-4 px-6'>{index + 1}</td>
                      <td
                        scope='row'
                        className='py-4 px-6 font-medium whitespace-nowrap'>
                        {item.buyer.fullname}
                      </td>
                      <td className='py-4 px-6'>{item.buyer.location}</td>
                      <td className='py-4 px-6 flex'>
                        {item.cart.order.map((list) => (
                          <p key={item.id}> {list.product.title}, </p>
                        ))}
                      </td>
                      <td className='py-4 px-6'>{RP.convert(item.total)}</td>
                      <td
                        className={
                          item.status === "pending"
                            ? "py-4 px-6 text-yellow-600"
                            : item.status === "On The Way"
                            ? "py-4 px-6 text-blue-600"
                            : item.status === "success"
                            ? "py-4 px-6 text-green-600"
                            : item.status === "Cancel"
                            ? "py-4 px-6 text-red-600"
                            : ""
                        }>
                        {item.status}
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
