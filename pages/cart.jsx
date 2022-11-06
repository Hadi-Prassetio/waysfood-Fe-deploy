import Image from "next/image";
import { useContext, useState, useEffect } from "react";
import Button from "../components/button";
import Input from "../components/input";
import Layout from "../components/layout";
import { CartContext } from "../context/cartContext";
import Rp from "rupiah-format";
import { useRouter } from "next/router";
import MapModal from "../components/map";
import { useMutation } from "react-query";
import { API } from "../pages/api/api";

export default function Cart() {
  const [cart, setCart] = useState();
  const [state, dispatch] = useContext(CartContext);

  const router = useRouter();

  const [map, setMap] = useState(false);

  useEffect(() => {
    const getCart = async (e) => {
      try {
        const response = await API.get("/cart-status");
        // console.log("res", response);
        // const unique = [
        //   ...new Map(
        //     response.data.data.order.map((item) => [item.product.id, item])
        //   ).values(),
        // ];
        // console.log("unique", unique);
        setCart(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getCart();
  }, []);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/order/${id}`);
      const response = await API.get("/cart-status");
      setCart(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  //Total Payment
  const total = cart?.order?.reduce((a, b) => {
    return a + b.sub_amount;
  }, 0);

  const totalQty = cart?.order?.reduce((a, b) => {
    return a + b.qty;
  }, 0);

  const ongkir = 10000;

  const totalPay = total + ongkir;

  const handlePlus = useMutation(async ({ id, qty, price }) => {
    const updateQty = qty + 1;
    const updateTotal = price * updateQty;
    const req = {
      qty: updateQty,
      sub_amount: updateTotal,
    };
    await API.patch(`/order/${id}`, req);
    const response = await API.get("/cart-status");
    setCart(response.data.data);
  });

  const handleMin = useMutation(async ({ id, qty, price, sub_amount }) => {
    if (qty == 1) {
      return;
    }
    const updateQty = qty - 1;
    const updateTotal = sub_amount - price;
    const req = {
      qty: updateQty,
      sub_amount: updateTotal,
    };
    await API.patch(`/order/${id}`, req);
    const response = await API.get("/cart-status");
    setCart(response.data.data);
  });

  const handleSubmit = useMutation(async (e) => {
    try {
      const data = {
        seller_id: cart.order[0].product.user.id,
        total: totalPay,
      };

      const response = await API.post("/transaction", data);

      const req = {
        qty: totalQty,
        sub_total: totalPay,
        status: "success",
      };
      await API.patch(`/cartID`, req);

      const token = response.data.data.token;

      window.snap.pay(token, {
        onSuccess: function (result) {
          /* You may add your own implementation here */
          console.log(result);
          router.push("/profile");
        },
        onPending: function (result) {
          /* You may add your own implementation here */
          console.log(result);
          router.push("/profile");
        },
        onError: function (result) {
          /* You may add your own implementation here */
          console.log(result);
        },
        onClose: function () {
          /* You may add your own implementation here */
          alert("you closed the popup without finishing the payment");
        },
      });
    } catch (error) {
      console.log(error);
    }
  });

  // Create config Snap payment page with useEffect here ...
  useEffect(() => {
    //change this to the script source you want to load, for example this is snap.js sandbox env
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    //change this according to your client-key
    const myMidtransClientKey = "SB-Mid-client-DAAlgk1G_QRRgxqW";

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    // optional if you want to set script attribute
    // for example snap.js have data-client-key attribute
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);

    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  return (
    <Layout pageTitle='Cart' counter={totalQty}>
      <div className='container max-w-6xl'>
        {cart == undefined ? (
          <div className='flex my-20 justify-center'>
            <img
              src='/empty.png'
              width={500}
              onClick={() => router.push("/")}
            />
          </div>
        ) : cart?.order == "" ? (
          <div className='flex my-20 justify-center'>
            <img
              src='/empty.png'
              width={500}
              onClick={() => router.push("/")}
            />
          </div>
        ) : (
          <div>
            <div className='mt-10'>
              <h1 className='font-bold text-4xl mb-5 font-mainFont'>
                {cart?.order[0]?.product?.user?.fullname}
              </h1>
              <p>Delivery Location</p>
              <div className='grid md:grid-cols-5 gap-4'>
                <div className='col-span-4'>
                  <Input placeholder='Location' />
                </div>
                <div className='col-span-1'>
                  <div
                    onClick={() => setMap(true)}
                    className='w-full md:py-2 py-1 bg-btn text-white my-3 rounded-lg flex justify-center hover:bg-main/70 active:bg-main cursor-pointer'>
                    <div className='mr-2'>Select On Map</div>
                    <img src='/map.svg' alt='map' />
                  </div>
                </div>
              </div>
            </div>
            <p>Review Your Order</p>
            <div className='grid md:grid-cols-3 md:gap-4'>
              <div className='md:col-span-2'>
                <div className='border-t-2 border-black mt-2 mb-2'></div>
                <div className='overflow-y-scroll scrollbar-hide h-[20rem]'>
                  {cart?.order?.map((item) => (
                    <div key={item.id} className='grid grid-cols-2 my-1'>
                      <div className='flex my-auto'>
                        <img
                          src={item.product.image}
                          width={150}
                          height={150}
                        />
                        <div className='ml-5 my-auto'>
                          <p className='font-bold font-mainFont'>
                            {item.product.title}
                          </p>
                          <button
                            onClick={() =>
                              handleMin.mutate({
                                id: item.id,
                                qty: item.qty,
                                price: item.product.price,
                                sub_amount: item.sub_amount,
                              })
                            }
                            className='md:mr-3 md:text-xl active:bg-main/50 w-4 rounded'>
                            -
                          </button>
                          <p className='inline px-1 bg-main/50 rounded'>
                            {item.qty}
                          </p>
                          <button
                            onClick={() =>
                              handlePlus.mutate({
                                id: item.id,
                                qty: item.qty,
                                price: item.product.price,
                              })
                            }
                            className='md:ml-3 md:text-xl active:bg-main/50 w-4 rounded'>
                            +
                          </button>
                        </div>
                      </div>
                      <div className='grid justify-items-end  my-auto'>
                        <p className='text-red-600'>
                          {Rp.convert(item.sub_amount)}
                        </p>
                        <div className='cursor-pointer align-bottom active:bg-main/50 mt-5 rounded-full'>
                          <img
                            onClick={() => handleDelete(item.id)}
                            src='/delete.svg'
                            width={20}
                            height={20}
                            alt='trash'
                          />
                        </div>
                      </div>
                      <div className='border-t-2 border-black mt-2 col-span-2'></div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className='border-t-2 border-black mt-2'></div>
                <div className='flex justify-between'>
                  <div>
                    <p>Subtotal</p>
                    <p>Qty</p>
                    <p>Ongkir</p>
                  </div>
                  <div className='text-end'>
                    <p className='text-red-600'>{Rp.convert(total)}</p>
                    <p className='text-red-600'>{totalQty}</p>
                    <p className='text-red-600'>{Rp.convert(ongkir)}</p>
                  </div>
                </div>
                <div className='border-t-2 border-black mt-2'></div>
                <div className='flex justify-between'>
                  <p className='text-red-600 font-bold'>Total</p>
                  <p className='text-red-600 font-bold'>
                    {Rp.convert(totalPay)}
                  </p>
                </div>
                <Button
                  onClick={() => handleSubmit.mutate()}
                  name='order'
                  className='w-full text-white bg-btn py-2 rounded-lg md:my-40 my-5 hover:bg-main/80 active:bg-main/70'
                />
              </div>
            </div>
            <MapModal isVisible={map} onClose={() => setMap(false)}>
              <iframe
                width='100%'
                height='400px'
                id='gmap_canvas'
                src='https://maps.google.com/maps?q=Dumbways%20&t=&z=17&ie=UTF8&iwloc=&output=embed'
                frameborder='0'
                scrolling='no'
                marginheight='0'
                marginwidth='0'
                title='myFrame'></iframe>
            </MapModal>
          </div>
        )}
      </div>
    </Layout>
  );
}
