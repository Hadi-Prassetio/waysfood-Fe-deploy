import Image from "next/image";
import Link from "next/link";
import { Fragment, useState, useEffect } from "react";
import { UserContext } from "../../context/userContext";
import DropDown from "./dropdown";
import { useContext } from "react";
import { useRouter } from "next/router";
import { API } from "../../pages/api/api";

export default function MenuUser() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [auth, setAuth] = useContext(UserContext);
  const [profile, setProfile] = useState({});
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

  const logOut = () => {
    setAuth({
      type: "LOGOUT",
    });
    router.push("/");
  };

  const role = auth.user.role;

  return (
    <Fragment>
      <div className='flex items-center'>
        <div className={role === "partner" ? "hidden" : "cursor-pointer "}>
          <Link href='/cart'>
            <Image src='/cart.svg' width={35} height={32.26} alt='cart' />
          </Link>
        </div>
        <div className='ml-5'>
          <button onClick={() => setShowDropdown(true)}>
            <div className=''>
              <img
                src={profile?.image == "" ? "/user.png" : profile?.image}
                width={50}
                alt='user'
                className='rounded-full'
              />
            </div>
          </button>
        </div>
      </div>
      <DropDown isVisible={showDropdown} onClose={() => setShowDropdown(false)}>
        <Link href='/profile'>
          <div
            className={
              role === "partner"
                ? "hidden"
                : "flex items-center mb-1 mr-10 ml-4 cursor-pointer"
            }>
            <Image
              src='/profile.svg'
              alt='profile'
              width={33.37}
              height={39.95}
            />
            <p className='ml-2'>Profile</p>
          </div>
        </Link>
        <Link href='/profile-partner'>
          <div
            className={
              role === "customer"
                ? "hidden"
                : "flex items-center mb-1 mr-10 ml-4 cursor-pointer"
            }>
            <Image
              src='/profile.svg'
              alt='profile'
              width={33.37}
              height={39.95}
            />
            <p className='ml-2'>Profile Partner</p>
          </div>
        </Link>
        <Link href='/add-product'>
          <div
            className={
              role === "customer"
                ? "hidden"
                : "flex items-center mb-1 mr-10 ml-4 cursor-pointer"
            }>
            <Image
              src='/product.svg'
              alt='profile'
              width={33.37}
              height={39.95}
            />
            <p className='ml-2'>Add Product</p>
          </div>
        </Link>
        <Link href='/list-product'>
          <div
            className={
              role === "customer"
                ? "hidden"
                : "flex items-center mb-1 mr-10 ml-4 cursor-pointer"
            }>
            <Image
              src='/product.svg'
              alt='profile'
              width={33.37}
              height={39.95}
            />
            <p className='ml-2'>List Product</p>
          </div>
        </Link>
        <hr />
        <div
          onClick={logOut}
          className='flex items-center mt-1  mr-10 ml-4 cursor-pointer'>
          <Image src='/logout.svg' alt='profile' width={33.37} height={39.95} />
          <p className='ml-2'>Logout</p>
        </div>
      </DropDown>
    </Fragment>
  );
}
