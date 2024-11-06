import React from "react";
import icon from "../../../assets/icon.png";
import shape2 from "../../../assets/shape2.svg";
import shape1 from "../../../assets/shape1.svg";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
//import { useDispatch } from "react-redux";
//import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
//import { Link } from "react-router-dom";
import "./style.css";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import LoginInput from "../../../components/LoginInput";
export default function LoginPage() {
  const loginInfos = {
    email: "",
    password: "",
  };
  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async (loginData) => {
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        });

        if (!response.ok) {
          const data = await response.json();
          if (data.error)
            throw new Error(data.error || "Failed to create account");
          return data;
        }
        return response.json();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onError: (error) => {
      console.error("Login failed:", error.message);
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success("Login successful");
      console.log("Login successful:", data);
    },
  });
  const [login, setLogin] = useState(loginInfos);
  const { email, password } = login;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
    console.log({ email, password });
  };

  const LoginValidation = Yup.object({
    email: Yup.string()
      .required("Email address is required.")
      .email("email is invalid."),
    password: Yup.string().required("Password is required"),
  });

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = (showPassword) => {
    setShowPassword(!showPassword);
  };
  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  const loginSubmit = async () => {
    const loginData = {
      email,
      password,
    };

    mutate(loginData);
  };

  return (
    <div className="gradient-background h-screen flex flex-col items-center justify-center gap-7   ">
      <div className="flex items-center justify-center gap-20">
        <div className="hidden lg:block ">
          <motion.img
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 7,
              ease: "linear",
            }}
            width="300"
            src={icon}
            alt="logo"
          />
        </div>
        {/*Login form */}
        <div className="login-bg shadow-md relative p-10   rounded-lg">
          <div>
            <img
              src={icon}
              className="block lg:hidden absolute z-[4] "
              alt="Logo"
              width="30"
            />
          </div>
          <div>
            <img
              className="absolute top-0 rounded-tl-lg z-[2] left-0"
              width="200"
              src={shape2}
              alt="triangle1"
            />
          </div>
          <div>
            <img
              className="absolute top-0 rounded-tl-lg  z-[3] left-0"
              width="160"
              src={shape1}
              alt="triangle1"
            />
          </div>
          <h2 className="font-bold text-3xl text-center mb-5">Login</h2>
          <Formik
            enableReinitialize
            initialValues={{
              email,
              password,
            }}
            validationSchema={LoginValidation}
            onSubmit={loginSubmit}
          >
            {(formik) => (
              <Form className=" login-form flex flex-col  mt-24  w-[300px]">
                <LoginInput
                  placeholder="Email"
                  type="text"
                  name="email"
                  onChange={handleChange}
                  autoFocus
                />

                <LoginInput
                  placeholder="Password"
                  showPassword={showPassword}
                  togglePasswordVisibility={togglePasswordVisibility}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onChange={handleChange}
                />

                <button
                  className="rounded-lg font-bold uppercase p-1 mt-7 bg-[#FFC122]   "
                  type="submit"
                >
                  {isPending ? "Loading..." : "LOG IN"}
                </button>
                <Link
                  className="rounded-lg hover:bg-stone-100 text-center font-bold uppercase p-1 mt-7 text-[#FFC122] border-or-website border active:bg-or-website active:text-white "
                  to="/signup"
                >
                  SIGN UP
                </Link>

                <div className="text-center p-2 ">
                  {isPending && (
                    <ClipLoader
                      color="#FAB400"
                      size={50}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  )}
                </div>
              </Form>
            )}
          </Formik>

          {/*Sign up */}
          <div></div>

          {isError && (
            <div className="text-or-website text-center">{error.message}</div>
          )}
        </div>
        {/* <Link to="/">
          <strong>Create a page</strong> for a celebrate,brand or buiseness
        </Link> */}
      </div>
      <p className="text-center font-bold ">
        Welcome to Friends – your new social hub where connections come to life.
      </p>
      {/*Register Form */}

      <p className="underline">
        <strong>@Copyright{new Date().getFullYear()}</strong>
      </p>
    </div>
  );
}
