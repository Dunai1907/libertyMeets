import styles from "./Registration.module.scss";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { Button, Form, Input, message } from "antd";
import axios, { AxiosError } from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { createRef, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { PASSWORD_VALIDATION_PATTERN } from "../../utils/stringUtils";

type PropsType = { appUrl: string; recaptchaKey: string };

export default function Registration({ appUrl, recaptchaKey }: PropsType) {
  const [terms, setTerms] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const recaptchaRef = createRef<ReCAPTCHA>();
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    session?.user && router.push("/posts");
  }, [router, session]);

  const error = (text: string) => {
    messageApi.open({
      type: "error",
      content: text,
      duration: 2.5,
      style: {
        marginTop: "10vh",
      },
    });
  };

  async function onFinish(values: any) {
    const recaptchaValue = recaptchaRef.current?.getValue();
    if (!recaptchaValue || !terms) {
      if (!terms && !recaptchaValue) {
        error(
          "It looks like you have not agreed to our terms and have not passed the reCAPTCHA verification"
        );
        return;
      } else if (!terms) {
        error("It looks like you have not agreed to our terms");
        return;
      } else {
        error("It looks like you have not passed the reCAPTCHA verification");
      }
    }

    values.recaptchaValue = recaptchaValue;

    try {
      const req = await axios.post(`${appUrl}/api/users/registration`, values);
      if (req.status === 200) {
        router.push("/auth/activate");
      }
    } catch (err) {
      error(
        "Please try again later or contact our customer support team for assistance"
      );
      recaptchaRef.current?.reset();
    }
  }

  return (
    <section className={styles.registarationWrapper}>
      <div className={styles.error}>{contextHolder}</div>
      <div className={styles.formBlock}>
        <div className={styles.logoInfo}>
          <div className={styles.logo}>
            <Image
              src="/decor/Unframed.svg"
              alt=""
              width={238}
              height={280}
              className={styles.logoImage}
            />
          </div>
        </div>
        <Form
          name="normal_login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          className={styles.form}
          validateTrigger={false}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true },
              { type: "email" },
              { type: "string", max: 100 },
            ]}
            colon={false}
            labelAlign="left"
            label="Email"
            labelCol={{ span: 5 }}
            className={styles.email}
          >
            <Input
              suffix={
                <Image
                  src="/decor/fax.svg"
                  alt=""
                  width={20}
                  height={20}
                  className={styles.vector}
                />
              }
              placeholder="Email"
              className={styles.inputEmail}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            colon={false}
            labelCol={{ span: 5 }}
            className={styles.password}
            labelAlign="left"
            rules={[
              { required: true, message: "Please input your password!" },
              {
                pattern: PASSWORD_VALIDATION_PATTERN,
                max: 100,
                message:
                  "Minimum 8 characters, at least 1 lowercase letter, 1 uppercase letter, 1 special character and 1 number",
              },
            ]}
          >
            <Input
              suffix={
                <Image
                  src="/decor/lock.svg"
                  alt=""
                  width={20}
                  height={20}
                  className={styles.vector}
                />
              }
              type="password"
              placeholder="Password"
              className={styles.inputPassword}
            />
          </Form.Item>

          <div className={styles.checkboxBlock}>
            <label className={styles.container}>
              <span className={styles.checkboxText}>
                {" "}
                I have read the{" "}
                <Link
                  target="_blank"
                  href={`${appUrl}/terms`}
                  rel="noopener noreferrer"
                  className={styles.termsLink}
                >
                  Terms & Privacy Policy
                </Link>
              </span>
              <input
                type="checkbox"
                className={styles.checkHighload}
                onClick={() => {
                  setTerms((terms) => !terms);
                }}
              />
              <span className={styles.highload2}></span>
            </label>

            <div className={styles.capchaBlock}>
              <ReCAPTCHA
                sitekey={recaptchaKey}
                ref={recaptchaRef}
                className={styles.capcha}
              />
            </div>
          </div>

          <Form.Item className={styles.signUp}>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.buttonSignUp}
            >
              <Image
                src="/decor/loginim.svg"
                alt=""
                width={16}
                height={14}
                className={styles.loginImage}
              />
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        <Link className={styles.link} href={"/signin"}>
          I already have an account!
        </Link>
      </div>
    </section>
  );
}
