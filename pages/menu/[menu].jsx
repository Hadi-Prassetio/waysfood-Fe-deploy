import Card from "../../components/card";
import Layout from "../../components/layout";
import Button from "../../components/button";
import { useRouter } from "next/router";
import Rp from "rupiah-format";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "../../context/cartContext";
import { useMutation } from "react-query";
import { API } from "../api/api";
import { Success } from "../../helper/toast";

export default function Menu() {
  const router = useRouter();
  const id = router.query.menu;

  const [detail, setDetail] = useState([]);

  const [cart, setCart] = useState([]);

  useEffect(() => {
    const getDetail = async (e) => {
      try {
        const response = await API.get(`/user/${id}`);
        setDetail(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getDetail();
  }, []);

  useEffect(() => {
    const getCart = async (e) => {
      try {
        const response = await API.get("/cart-status");
        setCart(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getCart();
  }, [setCart]);

  const addOrder = useMutation(async ({ id, price }) => {
    const auth = await API.get("/check-auth", {
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    });

    await API.post("cart", {
      user_id: auth.data.data.id,
      qty: 1,
      sub_total: 0,
      status: "pending",
    });

    const order = {
      product_id: id,
      sub_amount: price,
    };
    await API.post("/order", order);
    Success({ message: "Order Added" });
  });

  return (
    <Layout pageTitle='Menu'>
      <div className='container max-w-6xl '>
        <div className=' mt-10 mb-15 flex'>
          <img src={detail?.image} alt='logo' width={70} />
          <h1 className='md:text-4xl font-bold flex items-center ml-2 font-mainFont'>
            {detail?.fullname}, Menus
          </h1>
        </div>
        <div className='grid md:grid-cols-4 md:gap-4 grid-cols-2 gap-1 my-10'>
          {/* {addOrder.isLoading && <h1>Tunggu...</h1>} */}
          {detail?.products?.map((item) => (
            <div key={item.id}>
              <Card>
                <div>
                  <img
                    className='rounded-lg w-full p-3'
                    src={item.image}
                    alt='menu'
                  />
                </div>

                <div className='px-5'>
                  <h5 className='mb-2 md:text-xl font-bold tracking-tight text-gray-900 font-mainFont'>
                    {item.title}
                  </h5>

                  <p className='mb-3 md:font-normal text-xs text-gray-700 '>
                    {Rp.convert(item.price)}
                  </p>
                  <div>
                    <Button
                      onClick={() =>
                        addOrder.mutate({ id: item.id, price: item.price })
                      }
                      name='Order'
                      className='w-full bg-main text-txt rounded-xl md:py-2 py-1 my-2 hover:bg-base active:bg-gray-400'
                    />
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
