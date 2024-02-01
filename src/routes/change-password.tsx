import { useState } from "react";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { sendPasswordResetEmail } from "firebase/auth";
import {
  Error,
  Form,
  Input,
  Switcher,
  Title,
  Wrapper,
} from "../components/auth-components";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (isLoading || email === "") {
      return;
    }

    try {
      setIsLoading(true);
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage("Password reset email sent successfully!");
      navigate("/login");
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError(`Error: ${error.message}`);
        console.log(error.code, error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    }
  };

  return (
    <Wrapper>
      <Title>Change Password</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="email"
          value={email}
          placeholder="Email"
          type="email"
          required
          disabled={isLoading}
        />
        <Input
          type="submit"
          value={isLoading ? "Sending..." : "Send Password Reset Email"}
          disabled={isLoading}
        />
      </Form>
      {error !== "" && <Error>{error}</Error>}
      {successMessage !== "" && <div>{successMessage}</div>}
      <Switcher>
        Don't have an account?
        <Link to="/create-account"> Create One &rarr;</Link>
      </Switcher>
      <Switcher>
        Don't want to change the password?
        <Link to="/login"> Log In &rarr;</Link>
      </Switcher>
    </Wrapper>
  );
}
