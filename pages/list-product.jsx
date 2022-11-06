import Layout from "../components/layout";
import { useRouter } from "next/router";
import Rp from "rupiah-format";
import { API } from "./api/api";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/userContext";
import { Error, Success } from "../helper/toast";

export default function ListProduct() {
  const [auth, setAuth] = useContext(UserContext);
  const [product, setProduct] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const getProduct = async (e) => {
      try {
        const response = await API.get(`/user/${auth?.user?.id}`);
        setProduct(response.data.data.products);
      } catch (error) {
        console.log(error);
      }
    };
    getProduct();
  }, [setProduct]);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/product/${id}`);
      Success({ message: "Product Deleted" });
      const response = await API.get(`/user/${auth?.user?.id}`);
      setProduct(response.data.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout pageTitle='List Product'>
      {product.length == "" ? (
        <div className=' my-auto'>
          <img
            onClick={() => router.push("/add-product")}
            src='/no-product.png'
            alt='product'
            className='mx-auto'
          />
          <h1 className='text-6xl font-bold text-center'>
            Upload Product First
          </h1>
        </div>
      ) : (
        <div className='md:px-40 md:py-10'>
          <p className='font-bold text-4xl mb-10 font-header'>List Product</p>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm text-left text-gray-500'>
              <thead className='text-md text-gray-700 bg-gray-100'>
                <tr>
                  <th scope='col' className='py-3 px-6'>
                    No
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    Image
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    Product
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    Price
                  </th>
                  <th scope='col' className='py-3 px-6 text-center'>
                    Action
                  </th>
                </tr>
              </thead>
              {product?.map((item, index) => (
                <tbody key={item.index}>
                  <tr className='border-b bg-white'>
                    <td className='py-4 px-6'>{index + 1}</td>
                    <td
                      scope='row'
                      className='py-4 px-6 font-medium whitespace-nowrap'>
                      <img src={item.image} width={150} alt='product' />
                    </td>
                    <td className='py-4 px-6'>{item.title}</td>
                    <td className='py-4 px-6'>{Rp.convert(item.price)}</td>
                    <td className='py-4 px-6 '>
                      <div className='flex justify-center item-center'>
                        <button
                          onClick={() =>
                            router.push(`/update-product/${item.id}`)
                          }
                          className='bg-green-500 rounded-sm text-white px-3 hover:bg-green-400 active:bg-green-600 mr-4'>
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className='bg-red-500 rounded-sm mr-2 text-white px-3 hover:bg-red-400 active:bg-red-600'>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              ))}
            </table>
          </div>
        </div>
      )}
    </Layout>
  );
}
