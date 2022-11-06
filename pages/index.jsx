import { useRouter } from "next/router";
import { useContext, useState, useEffect } from "react";
import Card from "../components/card";
import Layout from "../components/layout";
import { UserContext } from "../context/userContext";
import Partner from "../fakeData/restaurant";
import { API } from "./api/api";

export default function Home() {
  const router = useRouter();
  const [auth, setAuth] = useContext(UserContext);
  const [shop, setShop] = useState([]);
  // console.log(shop);

  const [showLogin, setShowLogin] = useState(false);
  const loginFirst = () => setShowLogin(true);

  useEffect(() => {
    const getShops = async (e) => {
      try {
        const response = await API.get("/partners");
        setShop(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getShops();
  }, [setShop]);

  return (
    <Layout pageTitle='Home' showLogin={showLogin} setShowLogin={setShowLogin}>
      <div className='flex justify-center items-center bg-main mb-16'>
        <div className='grid md:grid-cols-5 content-center px-1 md:py-[122px]'>
          <div className='py-20 md:col-span-3'>
            <div className='md:ml-6'>
              <h1 className='text-txt text-5xl font-semibold mb-2 font-mainFont'>
                Are You Hungry?
              </h1>
              <h1 className='text-txt text-5xl font-semibold mb-7 font-mainFont'>
                Express Home Delivery
              </h1>
              <div className='grid md:grid-cols-3'>
                <div className='border-t-4 border-txt mr-2 ml-1 md:col-span-1'></div>
                <p className='px-3 md:col-span-2 text-sm w-80'>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Expedita error beatae adipisci aliquid repellat impedit
                  provident nisi quod, voluptates numquam.
                </p>
              </div>
            </div>
          </div>
          <div className='md:col-span-2 flex justify-center'>
            <img src='/pizza.svg' alt='pizza' width={393} height={408} />
          </div>
        </div>
      </div>
      <div className='container max-w-6xl'>
        <h1 className='text-2xl font-bold pb-3 font-mainFont'>
          Popular Restaurant
        </h1>
        <div className='grid md:grid-cols-4 md:gap-3 grid-cols-2 gap-1 my-8'>
          {shop?.map((item) => (
            <div
              key={item.id}
              onClick={
                !auth.isLogin
                  ? loginFirst
                  : () => router.push(`/menu/${item.id}`)
              }
              className='flex p-6 max-w-sm bg-white rounded-lg border
              border-gray-200 shadow-md hover:bg-main/50 active:bg-main/70
              cursor-pointer'>
              <img
                src={item.image}
                alt='shop'
                className='w-14 h-14 rounded-full object-cover object-center'
              />
              <h1 className='mb-2 md:text-2xl font-bold tracking-tight text-gray-900 mx-3 flex items-center font-mainFont'>
                {item.fullname}
              </h1>
            </div>
          ))}
        </div>
        <h1 className='text-2xl font-bold pb-3 font-mainFont'>
          Restaurant Near You
        </h1>
        <div className='grid md:grid-cols-4 md:gap-3 grid-cols-2 gap-1 my-8'>
          {shop?.slice(0, 4).map((item) => (
            <div
              key={item.id}
              onClick={
                !auth.isLogin
                  ? loginFirst
                  : () => router.push(`/menu/${item.id}`)
              }>
              <Card>
                <div>
                  <img
                    className='rounded-lg w-full h-40 p-3 object-cover'
                    src={item.products[0]?.image}
                    alt='menu'
                  />
                </div>

                <div className='px-5'>
                  <h5 className='mb-2 md:text-xl font-bold tracking-tight text-gray-900 font-mainFont'>
                    {item.products[0]?.title}
                  </h5>

                  <p className='mb-3 md:font-xl text-xs text-gray-700 '>
                    {item.location}
                  </p>
                </div>
              </Card>
            </div>
          ))}
        </div>
        <div className='grid md:grid-cols-4 md:gap-3 my-8 grid-cols-2 gap-1'></div>
      </div>
    </Layout>
  );
}
