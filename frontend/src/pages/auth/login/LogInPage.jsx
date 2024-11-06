import React from "react";
import icon from "../../../assets/icon.png";
import shape2 from "../../../assets/shape2.svg";
import shape1 from "../../../assets/shape1.svg";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
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

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = (showPassword) => {
    setShowPassword(!showPassword);
  };
  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  const loginSubmit = async () => {
    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/auth/login`,
        {
          email,
          password,
        }
      );
      setErr("");
      setSuccess(data.message);
    } catch (error) {
      setLoading(false);
      setErr(error.response.data.message);
      setSuccess("");
    }
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
                  LogIn
                </button>
              </Form>
            )}
          </Formik>

          {/*Sign up */}
          <div></div>

          {err && <div>{err}</div>}
          {success && <div>{success}</div>}
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
