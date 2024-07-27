import React, { useState, useRef, ReactElement } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import clsx from "clsx";
import { ReactComponent as ShowIcon } from "./assets/images/show.svg";
import { ReactComponent as HideIcon } from "./assets/images/hide.svg";

type FieldValues = {
  email: string;
  password: string;
};

export const App = () => {
  const {
    register,
    handleSubmit,
    formState: { isDirty, isSubmitted, errors, dirtyFields },
    trigger,
  } = useForm<FieldValues>({
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "all",
  });
  const [submitError, setSubmitError] = useState(false);
  const onSubmit: SubmitHandler<FieldValues> = () => {
    setSubmitError(true);
  };
  const emailInputElementRef = useRef<HTMLInputElement>();
  const { ref: useEmailRef, ...emailProps } = register("email", {
    required: true,
    validate: {
      email: (): boolean => {
        return emailInputElementRef.current?.checkValidity() as boolean;
      },
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  console.log(isSubmitted, isDirty, dirtyFields, errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <h1 className="form-title">Sign up</h1>
      <div className="form-fields">
        <div
          className={
            errors.email ? "invalid" : dirtyFields.email ? "valid" : ""
          }
        >
          <input
            type="email"
            placeholder="Enter your email address"
            required
            autoComplete="username"
            {...emailProps}
            ref={(ref) => {
              if (ref) {
                useEmailRef(ref);
                emailInputElementRef.current = ref;
              }
            }}
            onInput={() => {
              setSubmitError(false);
            }}
            onBlur={() => trigger("email")}
          />
        </div>
        {errors?.email && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              paddingLeft: "20px",
            }}
          >
            {errors?.email?.types?.required && (
              <p style={{ paddingLeft: "8px" }} className="invalid">
                Email field is required
              </p>
            )}
            {errors?.email?.types?.email && (
              <p style={{ paddingLeft: "8px" }} className="invalid">
                Email should be email
              </p>
            )}
          </div>
        )}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
          className={
            submitError || errors.password
              ? isSubmitted
                ? "invalid"
                : ""
              : dirtyFields.password
                ? "" // "valid"
                : ""
          }
        >
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Create your password"
            required
            autoComplete="new-password"
            {...register("password", {
              validate: {
                minLength: (value): boolean => {
                  if (!value) {
                    return false;
                  }
                  if (value.match(/\s+/)) {
                    return false;
                  }
                  if (value.length < 8) {
                    return false;
                  }
                  return true;
                },
                digit: (value): boolean => {
                  return Boolean(value.match(/\d+/));
                },
                uppercaseAndlowercase: (value, formValues): boolean => {
                  return Boolean(value.match(/(?=.*[a-z])(?=.*[A-Z])/));
                },
              },
            })}
            onInput={() => {
              setSubmitError(false);
            }}
            onBlur={() => trigger("password")}
          />
          {showPassword && (
            <button type="button" onClick={() => setShowPassword(false)}>
              <ShowIcon />
            </button>
          )}
          {showPassword || (
            <button type="button" onClick={() => setShowPassword(true)}>
              <HideIcon />
            </button>
          )}
        </div>

        {submitError || (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              paddingLeft: "20px",
            }}
          >
            <p
              className={
                isDirty
                  ? errors?.password?.types?.minLength
                    ? isSubmitted
                      ? "invalid"
                      : ""
                    : "valid"
                  : errors?.password?.types?.minLength
                    ? isSubmitted
                      ? "invalid"
                      : ""
                    : ""
              }
            >
              8 characters or more (no spaces)
            </p>
            <p
              className={
                isDirty
                  ? errors?.password?.types?.uppercaseAndlowercase
                    ? isSubmitted
                      ? "invalid"
                      : ""
                    : "valid"
                  : errors?.password?.types?.uppercaseAndlowercase
                    ? isSubmitted
                      ? "invalid"
                      : ""
                    : ""
              }
            >
              Uppercase and lowercase letters
            </p>

            <p
              className={
                isDirty
                  ? errors?.password?.types?.digit
                    ? isSubmitted
                      ? "invalid"
                      : ""
                    : "valid"
                  : errors?.password?.types?.digit
                    ? isSubmitted
                      ? "invalid"
                      : ""
                    : ""
              }
            >
              At least one digit
            </p>
          </div>
        )}

        {submitError && (
          <p className="invalid" style={{ textAlign: "center" }}>
            This password doesn't look right.
            <br />
            Please try again or reset it now. 
          </p>
        )}
      </div>
      <button type="submit">Sign up</button>
    </form>
  );
};
