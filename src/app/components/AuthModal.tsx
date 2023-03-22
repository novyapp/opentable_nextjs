"use client";

import useAuth from "@/hooks/useAuth";
import { Alert, CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "../context/AuthContext";
import AuthModalInput from "./AuthModalInput";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function AuthModal({ isSignin }: { isSignin: boolean }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { signin, signup } = useAuth();
  const { loading, data, error } = useContext(AuthenticationContext);

  const renderContent = (signinContent: string, signupContent: string) => {
    return isSignin ? signinContent : signupContent;
  };

  const initialStateInputs = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    password: "",
  };

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const [inputs, setInputs] = useState(initialStateInputs);

  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (isSignin) {
      if (inputs.password && inputs.email) {
        return setDisabled(false);
      }
    } else {
      if (
        inputs.firstName &&
        inputs.lastName &&
        inputs.email &&
        inputs.phone &&
        inputs.city &&
        inputs.password
      ) {
        return setDisabled(false);
      }
    }
    setDisabled(true);
  }, [inputs]);

  const handleClick = () => {
    if (isSignin) {
      signin({ email: inputs.email, password: inputs.password }, handleClose);
    } else {
      signup(inputs, handleClose);
    }
  };

  return (
    <div>
      <button
        className={`${renderContent(
          "bg-blue-400 text-white",
          ""
        )} border p-1 px-4 rounded mr-3`}
        onClick={handleOpen}
      >
        {renderContent("Sign in", "Sign Up")}
      </button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {loading ? (
            <div className="px-2 py-24 h-[550px] flex justify-center">
              <CircularProgress />
            </div>
          ) : (
            <div className="p-2 h-[550px]">
              <div className="uppercase font-bold text-center pb-2 border-b mb-2">
                <p className="text-small">
                  {renderContent("Sign In", "Create Account")}
                </p>
              </div>

              <div className="m-auto ">
                <h2 className="text-2xl font-light text-center">
                  {renderContent(
                    "Log Into Your Account",
                    "Create Your OpenTable Account"
                  )}
                </h2>
                <AuthModalInput
                  isSignin={isSignin}
                  inputs={inputs}
                  handleChangeInput={handleChangeInput}
                />
                {error ? (
                  <Alert severity="error" className="mb-4">
                    {error}
                  </Alert>
                ) : (
                  ""
                )}
                <button
                  className="uppercase bg-red-600 w-full text-white p-3 rounded text-sm mb-5 disabled:bg-gray-400"
                  disabled={disabled}
                  onClick={handleClick}
                >
                  {renderContent("Sign In", "Create Account")}
                </button>
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}
