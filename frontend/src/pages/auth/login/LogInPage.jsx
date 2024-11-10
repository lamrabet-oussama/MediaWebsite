import React from "react";
import icon from "../../../assets/icon.png";
import shape2 from "../../../assets/shape2.svg";
import shape1 from "../../../assets/shape1.svg";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  const navigate = useNavigate();
  const loginInfos = {
    email: "",
    password: "",
  };
  const queryClient = useQueryClient();
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
      console.log("Login failed:", error.stack);
      toast.error(error.message);
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onSuccess: () => {
      toast.success("Login successful");
      navigate("/");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });
  const [login, setLogin] = useState(loginInfos);
  const { email, password } = login;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
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

  const loginSubmit = async () => {
    const loginData = {
      email,
      password,
    };

    mutate(loginData);
  };

  return (
    <div className="gradient-background h-screen flex  flex-col items-center justify-center gap-7   ">
      <div className="flex items-center justify-center  gap-20">
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
        <div className="login-bg  shadow-md relative p-10  md:w-80  rounded-lg">
          <div>
            <img
              src={icon}
              className="block lg:hidden left-[10px] top-[15px] absolute z-[4] "
              alt="Logo"
              width="30"
            />
          </div>
          <div>
            <img
              className="absolute w-[150px] md:w-[200px] top-0 rounded-tl-lg z-[2] left-0"
              src={shape2}
              alt="triangle1"
            />
          </div>
          <div>
            <img
              className="absolute w-[120px]  md:w-[160px] top-0 rounded-tl-lg  z-[3] left-0"
              src={shape1}
              alt="triangle1"
            />
          </div>
          <h2 className="font-bold text-xl ml-6 md:ml-auto md:text-3xl  w-full text-center mb-5">
            Login
          </h2>
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
              <Form className=" login-form flex flex-col  mt-24  ">
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

          {isError && (
            <div className="text-orange-600 text-center">{error.message}</div>
          )}
        </div>
      </div>
      <p className="text-center  ">
        Welcome to Friends – your new social hub where connections come to life.
      </p>
      {/*Register Form */}

      <p className="underline">
        <strong>@Copyright{new Date().getFullYear()}</strong>
      </p>
    </div>
  );
}
