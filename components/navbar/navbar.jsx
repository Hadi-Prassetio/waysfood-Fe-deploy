import Image from "next/image";
import Link from "next/link";
import { Fragment, useState, useContext, useEffect } from "react";
import { UserContext } from "../../context/userContext";
import Login from "../auth/login";
import Register from "../auth/register";
import Button from "../button";
import Modal from "../modal";
import Menu from "./menu";
import { API } from "../../pages/api/api";

export default function Navbar({ showLogin, setShowLogin, counter }) {
  const [auth, setAuth] = useContext(UserContext);
  const isLogin = auth.isLogin;

  const [showRegister, setShowRegister] = useState(false);

  const switchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };
  const switchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const [count, setCount] = useState();

  useEffect(() => {
    if (isLogin) {
      try {
        const getCount = async (e) => {
          const response = await API.get("/cart-status");
          setCount(response.data.data);
        };
        getCount();
      } catch (error) {}
    }
  }, []);

  const counters = count?.order?.reduce((a, b) => {
    return a + b.qty;
  }, 0);

  return (
    <Fragment>
      <nav className=' bg-main sticky top-0'>
        <div className='flex justify-between items-center'>
          <div className='md:ml-10'>
            <Link
              href={auth.user.role === "partner" ? "/income-transaction" : "/"}>
              <Image
                src='/navicon.svg'
                width={124}
                height={40}
                alt='icon'
                className='cursor-pointer'
              />
            </Link>
          </div>
          <div className='md:mr-10 flex items-center'>
            {isLogin ? (
              <div>
                <div
                  className={
                    auth.user.role === "partner"
                      ? "hidden"
                      : counter === null
                      ? "hidden"
                      : counter === undefined
                      ? "hidden"
                      : counter === 0
                      ? "hidden"
                      : "circle z-40"
                  }>
                  {counter}
                </div>
                {/* <div
                  className={
                    auth.user.role === "partner"
                      ? "hidden"
                      : counter === null
                      ? "hidden"
                      : counters === 0
                      ? "hidden"
                      : counters === undefined
                      ? "hidden"
                      : "circle z-30"
                  }>
                  {counters}
                </div> */}

                <Menu />
              </div>
            ) : (
              <>
                <Button name='Register' onClick={() => setShowRegister(true)} />
                <Button name='Login' onClick={() => setShowLogin(true)} />
                <Modal
                  isVisible={showLogin}
                  onClose={() => setShowLogin(false)}>
                  <Login />
                  <p className='text-center'>
                    Don&apos;t have an Account? klik
                    <b className='cursor-pointer' onClick={switchToRegister}>
                      Here
                    </b>
                  </p>
                </Modal>
                <Modal
                  isVisible={showRegister}
                  onClose={() => setShowRegister(false)}>
                  <Register />
                  <p className='text-center text-pholder'>
                    Already have an Account? klik
                    <b className='cursor-pointer' onClick={switchToLogin}>
                      Here
                    </b>
                  </p>
                </Modal>
              </>
            )}
          </div>
        </div>
      </nav>
    </Fragment>
  );
}
