import React, { useEffect, useState } from "react";
import backgroundImage from "../assets/bg_register.jpg";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { RegisterUser } from "../../apicalls/users";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { message } from "antd";
const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
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
      const response = await RegisterUser(formData);
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        navigate("/login");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error);
    }
    setFormData({
      name: "",
      email: "",
      password: "",
    });
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  return (
    <div className="flex w-full h-[100vh]">
      <img
        alt=""
        src={backgroundImage}
        className="fixed top-0 -z-10 left-0 flex object-cover h-screen w-full opacity-70"
      />
      <div className="w-[30rem] flex justify-center items-center h-full bg-white">
        <div className="flex flex-col items-center justify-center">
          <div>
            <img alt="" src={logo} className="w-40" />
            <div className="p-3 space-y-2">
              <h1 className="font-semibold text-black  rounded-lg font-montserrat text-3xl">
                Create your account
              </h1>
              <p className="text-lg font-medium text-gray-700">
                Have an account?{" "}
                <Link to="/login" className="text-red-500 font-bold">
                  Log in now
                </Link>
              </p>
              <form className="space-y-3" action="POST" onSubmit={handleSubmit}>
                <div className="pt-4">
                  <label
                    htmlFor="name"
                    className="block my-2 text-md font-medium text-black"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="off"
                    className="border  rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 border-gray-600 placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
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
                <div>
                  <button
                    type="submit"
                    className="w-full bg-red-700 text-white hover:bg-red-600 font-medium rounded-lg text-md px-5 py-2.5 text-center"
                  >
                    Create an account
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

export default Register;
