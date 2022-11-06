import dateFormat from "dateformat";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Rp from "rupiah-format";
import Button from "../components/button";
import Layout from "../components/layout";
import Transaction from "../components/transaction";
import { API } from "./api/api";

export default function ProfilePartner() {
  const [profile, setProfile] = useState({});
  const [income, setIncome] = useState();
  const router = useRouter();

  useEffect(() => {
    const getProfile = async (e) => {
      try {
        const response = await API.get("/check-auth");
        setProfile(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getProfile();
  }, [setProfile]);

  useEffect(() => {
    const getIncome = async (e) => {
      const response = await API.get("/incomes");
      setIncome(response.data.data);
    };
    getIncome();
  }, []);

  return (
    <Layout pageTitle='Profile Partner'>
      <div className='container max-w-6xl '>
        <div className='grid md:grid-cols-5 md:mt-20'>
          <div className='col-span-3'>
            <h1 className='font-bold md:text-4xl md:mb-10 font-mainFont'>
              Profile Partner
            </h1>
            <div className='grid grid-cols-3 gap-4'>
              <div>
                <img
                  src={profile?.image == "" ? "/user.png" : profile.image}
                  alt='user'
                />
              </div>
              <div className='grid col-span-2'>
                <div className='grid content-center'>
                  <h1 className='font-bold text-profile text-2xl'>Fullname</h1>
                  <p>{profile.fullname}</p>
                </div>
                <div className='grid content-center'>
                  <h1 className='font-bold text-profile text-2xl'>Email</h1>
                  <p>{profile.email}</p>
                </div>
                <div className='grid content-end'>
                  <h1 className='font-bold text-profile text-2xl'>Phone</h1>
                  <p>{profile.phone}</p>
                </div>
              </div>
              <Button
                name='Edit Profile'
                className='w-full py-3 rounded-lg bg-btn hover:bg-main/50 active:bg-main/80 text-white mt-5'
                onClick={() => router.push("/edit-profile-partner")}
              />
            </div>
          </div>
          <div className='col-span-2'>
            <h1 className='font-bold md:text-4xl mb-10 font-mainFont'>
              History Order
            </h1>
            {income == "" ? (
              <img src='/empty.png' alt='no transaction' width={300} />
            ) : (
              <div className='overflow-y-auto scrollbar-hide h-[17rem]'>
                {income?.map((item) => (
                  <div key={item.id} className='my-1'>
                    <Transaction>
                      <div className='grid grid-cols-2'>
                        <div>
                          <h1 className='font-bold text-md font-mainFont text-lg'>
                            {item.buyer.fullname}
                          </h1>

                          <h1 className='text-sm mb-5'>
                            <b>{dateFormat(item.created_at, "dddd,   ")}</b>
                            {dateFormat(item.created_at, "d mmmm yyyy,   ")}
                          </h1>
                          <h1 className='font-bold text-md text-profile'>
                            Total : {Rp.convert(item.total)}
                          </h1>
                        </div>
                        <div className='grid justify-items-end'>
                          <img src='/navicon.svg' alt='' />
                          <h1
                            className={
                              item.status == "success"
                                ? "w-3/4 rounded-md bg-green-200 text-green-600 text-center my-auto py-1"
                                : "w-3/4 rounded-md bg-yellow-200 text-yellow-800 text-center my-auto py-1"
                            }>
                            {item.status}
                          </h1>
                        </div>
                      </div>
                    </Transaction>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
