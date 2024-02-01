import { useState } from "react";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
    Error,
    Form,
    Input,
    Switcher,
    Title,
    Wrapper,
} from "../components/auth-components";
import GithubBtn from "../components/github-btn";
export default function CreateAccount() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { name, value },
        } = e;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        if (isLoading || email === "" || password === "") {
            return;
        }
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (error) {
            if (error instanceof FirebaseError) {
                setError(error.message);
                console.log(error.code, error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Wrapper>
            <Title>Login x</Title>
            <Form onSubmit={onSubmit}>
                <Input
                    name="email"
                    value={email}
                    placeholder="email"
                    type="email"
                    required
                    onChange={onChange}
                />
                <Input
                    name="password"
                    value={password}
                    placeholder="password"
                    type="password"
                    required
                    onChange={onChange}
                />
                <Input
                    type="submit"
                    value={isLoading ? "Loading..." : "create account"} />
            </Form>
            {error != "" ? <Error>{error}</Error> : null}
            <Switcher>
                Don't have an account?
                <Link to="/create-account">Create one &rarr;</Link>
            </Switcher>
            <Switcher>
                Did you forget your password?
                <Link to="/change-password">Change it &rarr;</Link>
            </Switcher>
            <GithubBtn />

        </Wrapper>
    );
}

