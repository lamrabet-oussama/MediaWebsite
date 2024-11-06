import React, { useState } from "react";
import { useField } from "formik";
import { ErrorMessage } from "formik";
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdError } from "react-icons/md";
import { motion } from "framer-motion";
import { MdEmail } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";

export default function LoginInput({
  togglePasswordVisibility,
  showPassword,
  placeholder,
  ...props
}) {
  const [inputValue, setInputValue] = useState(false);
  const handleShowPassword = () => {
    setInputValue(!inputValue); // Mettre à jour l'état local
    togglePasswordVisibility(inputValue);
  };
  const [field, meta] = useField(props);
  let check = meta.touched && meta.error;
  const Icons = (fieldName) => {
    switch (fieldName) {
      case "email":
        return (
          <MdEmail
            className={`${check ? "text-[#FF0000]" : "text-[#FAB400]"}`}
          />
        );
      case "username":
        return (
          <FaUser
            className={`${check ? "text-[#FF0000]" : "text-[#FAB400]"}`}
          />
        );
      case "fullName":
        return (
          <MdOutlineDriveFileRenameOutline
            className={`${check ? "text-[#FF0000]" : "text-[#FAB400]"}`}
          />
        );
      case "password":
        return (
          <RiLockPasswordFill
            className={`${check ? "text-[#FF0000]" : "text-[#FAB400]"}`}
          />
        );
      case "confirmPassword":
        return (
          <RiLockPasswordFill
            className={`${check ? "text-[#FF0000]" : "text-[#FAB400]"}`}
          />
        );

      default:
        return <div className="inline"></div>;
    }
  };

  return (
    <div className="z-10 relative mb-7 ">
      <motion.div
        initial={{ x: 0 }}
        animate={check && { x: [-2, 2, 0] }}
        transition={{
          duration: 0.4,
        }}
        className={`flex items-center relative gap-2   border-b-2  pb-1 ${
          check ? "border-[#FF0000]" : "border-[#FAB400] "
        } `}
      >
        {Icons(field.name)}

        <input
          placeholder={placeholder}
          className={` bg-transparent outline-none w-full ${
            check ? "placeholder-[#FF0000]" : "placeholder-[#FAB400]"
          }`}
          type={field.type}
          name={field.name}
          {...field}
          {...props}
        />
        {field.name === "password" && (
          <button className="absolute right-6 " onClick={handleShowPassword}>
            {inputValue ? (
              <FaEye
                className={`text-[#FAB400] text-lg ${
                  check ? "text-[#FF0000]" : "text-[FAB400]"
                }`}
              />
            ) : (
              <FaEyeSlash
                className={`text-[#FAB400] text-lg ${
                  check ? "text-[#FF0000]" : "text-[FAB400]"
                }`}
              />
            )}
          </button>
        )}
        {console.log(showPassword)}
        {check && (
          <MdError
            className={`absolute  right-0 ${
              check ? "text-[#FF0000]" : "text-[FAB400]"
            } `}
          />
        )}
      </motion.div>
      {check && (
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: [-2, 0, 2, 0] }}
          transition={{
            duration: 0.2,
          }}
          className=" text-[#FF0000] absolute  text-[0.75em]   "
        >
          <ErrorMessage name={field.name} />
        </motion.div>
      )}
    </div>
  );
}
