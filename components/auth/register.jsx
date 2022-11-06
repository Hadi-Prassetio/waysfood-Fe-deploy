import { useState } from "react";
import Button from "../button";
import Input from "../input";
import { useMutation } from "react-query";
import { API } from "../../pages/api/api";
import { Success, Error } from "../../helper/toast";

export default function Register() {
  const [form, setForm] = useState({});
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      const response = await API.post("/register", form);
      Success({ message: "Success Register" });
    } catch (error) {
      Error({ message: "Failed Register" });
      console.log("apiii", API);
    }
  });

  return (
    <form onSubmit={(e) => handleSubmit.mutate(e)}>
      <h3 className='mb-4 text-5xl font-medium text-main '>Register</h3>
      <Input
        placeholder='Email'
        type='email'
        name='email'
        onChange={handleChange}
      />
      <Input
        placeholder='Password'
        type='password'
        name='password'
        onChange={handleChange}
      />
      <Input
        placeholder='Fullname'
        type='text'
        name='fullname'
        onChange={handleChange}
      />
      <Input
        placeholder='Gender'
        type='text'
        name='gender'
        onChange={handleChange}
      />
      <Input
        placeholder='Phone'
        type='number'
        name='phone'
        onChange={handleChange}
      />
      <select
        className='w-full py-2 my-3 pl-1 bg-auth bg-opacity-25 rounded-md border-2 border-gray-400/70 focus:outline-none focus:ring focus:ring-main'
        name='role'
        onChange={handleChange}>
        <option selected className=' hidden'>
          Role
        </option>
        <option value='customer'> Customer</option>
        <option value='partner'> Partner</option>
      </select>
      <Button
        name='Register'
        type='submit'
        className='w-full bg-btn text-white rounded-lg py-2 my-5 hover:bg-main/70 active:bg-main/70'
      />
    </form>
  );
}
