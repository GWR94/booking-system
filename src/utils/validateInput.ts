import { loginSchema } from "../validation/schema";
import { FormData } from "../components/auth/Login";
type FormInput = "email" | "password";

const validateInputs = (
  formData: FormData,
  setFormData: (formData: FormData) => void,
  type?: FormInput
): boolean => {
  const validationData = {
    email: formData.email.value,
    password: formData.password.value,
  };

  // get validation errors from joi validation library
  const { error } = loginSchema.validate(validationData, {
    abortEarly: false,
  });

  let updatedFormData: FormData = formData;
  if (error) {
    if (type) {
      // filter out others to return error which matches the input type
      const err = error.details?.filter((detail) => detail.path[0] === type)[0];
      if (err) {
        updatedFormData = {
          ...updatedFormData,
          [type]: {
            ...updatedFormData[type],
            errorMsg: err.message,
          },
        };
        setFormData(updatedFormData);
        return false;
      } else {
        updatedFormData = {
          ...updatedFormData,
          [type]: {
            ...updatedFormData[type],
            errorMsg: "",
          },
        };
        setFormData(updatedFormData);
        return true;
      }
    }
    error.details.forEach((detail) => {
      // get key for incorrectly validated
      const key = detail.path[0] as keyof typeof formData;
      if (key in updatedFormData) {
        updatedFormData[key] = {
          ...updatedFormData[key],
          errorMsg: detail.message,
        };
      }
      setFormData(updatedFormData);
    });
    return false;
  } else {
    // clear all error messages if there are no validation errors.
    setFormData({
      ...updatedFormData,
      email: { ...updatedFormData.email, errorMsg: "" },
      password: { ...updatedFormData.password, errorMsg: "" },
    });
    return true;
  }
};

export default validateInputs;
