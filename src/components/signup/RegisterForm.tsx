import React, { useState } from "react";
import TextField from "../TextField";
import { CiLock, CiUser, CiMail } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../global/axios";

interface RegisterFormProps {}

const RegisterForm: React.FC<RegisterFormProps> = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const [isEmailCheck, setIsEmailCheck] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);

  const navigate = useNavigate();

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    emailCheckHandler(emailValue);
  };

  const onChangePasswordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "password") {
      setPassword(value);
      const valid = passwordCheckHandler(value, confirm);
      setIsPasswordValid(valid);
    } else if (name === "confirm") {
      setConfirm(value);
      passwordCheckHandler(password, value);
    }
  };

  const emailCheckHandler = async (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email === "") {
      setEmailError("이메일을 입력해주세요.");
      setIsEmailAvailable(false);
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("이메일 주소 형식이 올바르지 않습니다.");
      setIsEmailAvailable(false);
      return false;
    } else {
      setEmailError("사용 가능한 이메일입니다.");
      setIsEmailCheck(true);
      setIsEmailAvailable(true);
      return true;
    }
  };

  const passwordCheckHandler = (password: string, confirm: string) => {
    const passwordRegex = /^[a-z\d!@*&-_]{8,16}$/;
    if (password === "") {
      setPasswordError("비밀번호를 입력해주세요.");
      return false;
    } else if (!passwordRegex.test(password)) {
      setPasswordError(
        "비밀번호는 8~16자의 영소문자, 숫자, !@*&-_만 입력 가능합니다."
      );
      return false;
    } else if (confirm && confirm !== password) {
      setPasswordError("");
      setConfirmError("비밀번호가 일치하지 않습니다.");
      return false;
    } else {
      setPasswordError("");
      setConfirmError("");
      return true;
    }
  };

  const signupHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailCheckResult = await emailCheckHandler(email);
    if (emailCheckResult) setEmailError("");
    else return;

    if (!isEmailCheck || !isEmailAvailable) {
      alert("아이디 중복 검사를 해주세요.");
      return;
    }

    const passwordCheckResult = passwordCheckHandler(password, confirm);
    if (passwordCheckResult) {
      setPasswordError("");
      setConfirmError("");
    } else return;

    try {
      const response = await axios.post("http://localhost:8080/member/signUp", {
        name: name,
        email: email,
        password: password,
      });
      if (response.data.success) {
        sessionStorage.setItem("loginEmail", email);
        navigate("/login");
      } else {
        alert("회원가입에 실패하였습니다. 다시 시도해주세요.");
      }
    } catch (error: any) {
      if (error.response) {
        const { errorCode } = error.response.data;
        if (errorCode === 501) {
          setEmailError("이미 사용중인 이메일입니다.");
        } else {
          alert("회원가입에 실패하였습니다. 다시 시도해주세요.");
        }
        setIsEmailAvailable(false);
        setIsEmailCheck(false);
      } else {
        alert("회원가입에 실패하였습니다. 다시 시도해주세요.");
        console.error(error);
      }
    }
  };

  return (
    <section className="w-[500px] h-auto flex flex-col justify-between items-center">
      <form
        className="flex-1 flex flex-col justify-center items-center gap-5"
        onSubmit={signupHandler}
      >
        <h2 className="mt-5">계정 만들기</h2>
        <TextField
          type="text"
          icon={CiUser}
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          type="email"
          icon={CiMail}
          placeholder="이메일"
          value={email}
          onChange={onChangeHandler}
          name="email"
        />
        {emailError && (
          <div className="text-red-500 text-sm self-start">{emailError}</div>
        )}
        <TextField
          type="password"
          icon={CiLock}
          placeholder="비밀번호"
          name="password"
          value={password}
          onChange={onChangePasswordHandler}
        />
        {passwordError && (
          <div className="text-red-500 text-sm self-start">{passwordError}</div>
        )}
        {isPasswordValid && (
          <>
            <TextField
              type="password"
              placeholder="비밀번호 확인"
              name="confirm"
              value={confirm}
              onChange={onChangePasswordHandler}
            />
            {confirmError && (
              <div className="text-red-500 text-sm self-start">
                {confirmError}
              </div>
            )}
          </>
        )}

        <div className="w-[364px] h-10 flex justify-center items-center rounded-lg bg-black mb-5 hover:bg-gray">
          <button className="text-sm text-white" disabled={!isEmailAvailable}>
            가입하기
          </button>
        </div>

        <div className="text-gray text-sm">
          이미 계정이 존재하신가요?{" "}
          <Link to="/signin" className="text-black hover:underline">
            로그인
          </Link>
        </div>
      </form>
    </section>
  );
};

export default RegisterForm;
