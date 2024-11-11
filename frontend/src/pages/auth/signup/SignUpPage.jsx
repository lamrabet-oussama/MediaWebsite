import React from "react";
import { useNavigate } from "react-router-dom";

import icon from "../../../assets/icon.png";
import shape2 from "../../../assets/shape2.svg";
import shape1 from "../../../assets/shape1.svg";
import "./register.css";
import { useState } from "react";
import { FaRegQuestionCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import LoginInput from "../../../components/LoginInput";

import ClipLoader from "react-spinners/ClipLoader";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const navigate = useNavigate();
  const SignupInfos = {
    email: "",
    password: "",
    username: "",
    birthDay: new Date().getDate(),
    birthMonth: new Date().getMonth() + 1,
    birthYear: new Date().getFullYear(),
    fullName: "",
    // lastName: "",
    // gender: "",
  };

  const [signup, setSignup] = useState(SignupInfos);
  const {
    email,
    fullName,
    // lastName,
    password,
    username,
    birthDay,
    birthMonth,
    birthYear,
    // gender,
  } = signup;
  // const { mutate, isError, isPending, error } = useMutation({
  //   mutationFn: async (signupData) => await axios.post("/api/auth/signup", signupData)
  //   ,
  //   onError: (error) => {
  //     alert("Signup failed:", error.message);
  //   },
  //   onSuccess: (data) => {
  //     console.log("Signup successful:", data);
  //     // Vous pouvez rediriger l'utilisateur ou afficher un message de succès ici
  //   },
  // });
  const queryClient = useQueryClient();
  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async (signupData) => {
      try {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signupData),
        });

        if (!response.ok) {
          const data = await response.json();
          console.log(data);
          if (data.error)
            throw new Error(data.error || "Failed to create account");
          return data;
        }
        return response.json();
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onError: (error) => {
      console.error("Signup failed:", error.stack);
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Signup successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignup({ ...signup, [name]: value });
    console.log({ email, password });
  };
  const isAdult = (day, month, year) => {
    let currentDay = new Date();
    const DiffMonth = currentDay.getMonth() + 1 - month;
    const DiffDay = currentDay.getDate() - day;
    const age = currentDay.getFullYear() - year;
    if (DiffMonth < 0 || (DiffMonth === 0 && DiffDay < 0)) {
      return false;
    }
    return age >= 18;
  };

  const SignupValidation = Yup.object({
    email: Yup.string()
      .required("Email address is required.")
      .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, "Email is invalid."),
    fullName: Yup.string()
      .required("Full Name is required!")
      .min(7, "First name must be between 7 and 10 caracters.")
      .max(20, "First name must be between 2 and 10 caracters.")
      .matches(
        /^[aA-zZ\s]+$/,
        "Numbers and special characters are not allowed."
      ),
    birthDay: Yup.number().required("Day is required"),
    birthMonth: Yup.number().required("Month is required"),
    birthYear: Yup.number()
      .required("Year is required")
      .test("is-adult", "You are under 18", function () {
        const { birthDay, birthMonth, birthYear } = this.parent;
        return isAdult(birthDay, birthMonth, birthYear);
      }),
    password: Yup.string()
      .required(
        "Enter at least a combination of six numbers,letters and special characters! "
      )
      .min(6, "At least 6 characters")
      .max(20, "Password can't be more than 20 characters!")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."
      ),
    username: Yup.string().required("Username is required!"),
  });

  /*Generate an array of the selected date */

  const tempYear = new Date().getFullYear();
  const numberOfYears = parseInt(tempYear) - 1987 + 1;
  const years = Array.from(
    new Array(numberOfYears),
    (val, index) => tempYear - index
  );
  const months = Array.from(new Array(12), (val, index) => 1 + index);
  const NumOfDays = new Date(birthYear, birthMonth, 0).getDate();
  const days = Array.from(new Array(NumOfDays), (val, index) => 1 + index);

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = (showPassword) => {
    setShowPassword(!showPassword);
  };

  const registerSubmit = async () => {
    const signupData = {
      email,
      fullName,
      password,
      username,
      birthDay: String(birthDay),
      birthMonth: String(birthMonth),
      birthYear: String(birthYear),
    };
    mutate(signupData);
  };

  return (
    <div className="gradient-background h-screen flex flex-col items-center justify-center w-full ">
      <div className="     ">
        <div className=" ">
          <div className="signup-bg shadow-md   relative p-6  m-3 rounded-lg">
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
                alt="triangle2"
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

            <h2 className="font-bold text-lg md:text-3xl text-center p-3  ml-28 mr-20  mb-5">
              Sign Up
            </h2>

            <Formik
              enableReinitialize
              initialValues={{
                email,
                fullName,
                // lastName,
                password,
                username,
                birthDay,
                birthMonth,
                birthYear,
                // gender,
              }}
              onSubmit={registerSubmit}
              validationSchema={SignupValidation}
            >
              {(formik) => (
                <Form className=" signup-form flex  flex-col   mt-20  ">
                  <div className=" grid grid-cols-1 grid-rows-1  gap-6">
                    <div>
                      <LoginInput
                        placeholder="Full Name"
                        type="text"
                        name="fullName"
                        onChange={handleChange}
                      />
                    </div>

                    {/* <div className="flex-1">
                    <LoginInput
                      placeholder="Last Name"
                      type="text"
                      name="lastName"
                      onChange={handleChange}
                    />
                  </div> */}
                  </div>
                  <LoginInput
                    placeholder="Username"
                    type="text"
                    name="username"
                    onChange={handleChange}
                  />
                  <LoginInput
                    placeholder="Email"
                    type="text"
                    name="email"
                    onChange={handleChange}
                  />

                  <LoginInput
                    placeholder="Password"
                    showPassword={showPassword}
                    togglePasswordVisibility={togglePasswordVisibility}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    onChange={handleChange}
                  />
                  <div className="flex flex-col gap-2 mt-6  text-[#FAB400] ">
                    <div className="font-bold flex items-center gap-1 mt-1">
                      <p className="">Date of birth</p>
                      <FaRegQuestionCircle />
                    </div>
                    <div>
                      <div className="flex justify-center gap-5  ">
                        <Field
                          as="select"
                          className="flex-1 bg-transparent outline-none border-b-2 border-[#FAB400] "
                          name="birthDay"
                          value={birthDay}
                          onChange={handleChange}
                        >
                          {days.map((day, index) => {
                            return (
                              <option value={day} key={index}>
                                {day}
                              </option>
                            );
                          })}
                        </Field>
                        <Field
                          as="select"
                          className="flex-1 bg-transparent outline-none border-b-2 border-[#FAB400]  "
                          name="birthMonth"
                          value={birthMonth}
                          onChange={handleChange}
                        >
                          {months.map((month, index) => {
                            return (
                              <option value={month} key={index}>
                                {month}
                              </option>
                            );
                          })}
                        </Field>
                        <Field
                          as="select"
                          className="flex-1 bg-transparent outline-none border-b-2 border-[#FAB400]  "
                          name="birthYear"
                          value={birthYear}
                          onChange={handleChange}
                        >
                          {years.map((year, index) => {
                            return (
                              <option value={year} key={index}>
                                {year}
                              </option>
                            );
                          })}
                        </Field>
                      </div>
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: [-2, 0, 2, 0] }}
                        transition={{
                          duration: 0.2,
                        }}
                        className=" text-[#FF0000]   text-[0.75em]   "
                      >
                        <ErrorMessage name="birthYear" />
                      </motion.div>
                    </div>
                    {/* 
                  <div className="font-bold flex mt-5 items-center gap-1">
                    <p className="">Gender</p>
                    <FaRegQuestionCircle />
                  </div> */}
                    {/* <div className="flex justify-center items-center gap-4 flex-col  ">
                    <div className="flex items-center  gap-8 justify-center">
                      <label className="container " htmlFor="male">
                        Male
                        <Field
                          className=""
                          type="radio"
                          name="gender"
                          id="male"
                          value="Male"
                          onChange={handleChange}
                        />
                        <span className="mark"></span>
                      </label>
                      <label className="container" htmlFor="female">
                        Female
                        <Field
                          className=""
                          type="radio"
                          name="gender"
                          id="female"
                          value="Female"
                          onChange={handleChange}
                        />
                        <span className="mark"></span>
                      </label>
                    </div>
                  </div> */}
                    {/* <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: [-2, 0, 2, 0] }}
                    transition={{
                      duration: 0.2,
                    }}
                    className=" text-[#FF0000] self-start  text-[0.75em]   "
                  >
                    <ErrorMessage name="gender" />
                  </motion.div> */}
                  </div>
                  <div className="text-sm text-right select-none">
                    {/* <Link
                    className=" underline text-blue-500 font-[600] "
                    to="/forgot"
                  >
                    Forgot password ?
                  </Link> */}
                  </div>
                  <button
                    className="rounded-lg font-bold uppercase p-1 mt-7 bg-[#FFC122]   "
                    type="submit"
                  >
                    {isPending ? "Loading..." : "Sign up"}
                  </button>
                  <Link to="/login">
                    <div
                      className="rounded-lg border-2 text-center font-bold uppercase p-1 mt-5 text-[#FFC122] hover:bg-[#FFC122] transition-all active:scale-90 hover:text-black  "
                      type="submit"
                    >
                      Sign In
                    </div>
                    <div className="text-center mt-5 text-orange-700">
                      {isError && <p> {error.message} </p>}
                    </div>
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
                  </Link>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
