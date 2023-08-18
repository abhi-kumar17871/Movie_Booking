import React, { useEffect, useState } from "react";
import backgroundImage from "../assets/bg_login.jpg";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { LoginUser } from "../../apicalls/users";
import { useDispatch } from "react-redux";
import { ShowLoading, HideLoading } from "../../redux/loadersSlice";
import { message } from "antd";
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(ShowLoading());
      const response = await LoginUser(formData);
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        localStorage.setItem("token", response.data);
        window.location.href = "/";
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error);
    }
  };
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);
  return (
    <div className="flex w-full flex-row-reverse  h-[100vh]">
      <img
        alt=""
        src={backgroundImage}
        className="fixed top-0 -z-10 left-0 flex object-cover h-screen w-full opacity-70"
      />
      <div className="flex items-center justify-center w-[30rem] h-full bg-white">
        <div className="flex flex-col items-center justify-center">
          <div>
            <img alt="" src={logo} className="w-40" />
            <div className="p-6 space-y-2">
              <h1 className="font-semibold text-black  rounded-lg font-montserrat text-3xl">
                Log in to your account
              </h1>
              <p className="text-lg font-medium text-gray-700">
                Don't have an account?{" "}
                <Link to="/register" className="text-red-500 font-bold">
                  Sign Up
                </Link>
              </p>
              <form className="space-y-6" action="#" onSubmit={handleSubmit}>
                <div className="pt-4">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-md font-medium text-black"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="off"
                    className="border rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  border-gray-600 placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-md font-medium text-black"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="off"
                    placeholder="••••••••"
                    className="border rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  border-gray-600 placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="py-8">
                  <button
                    type="submit"
                    className="w-full bg-red-700 text-white hover:bg-red-600 font-medium rounded-lg text-md px-5 py-2.5 text-center"
                  >
                    Log in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
