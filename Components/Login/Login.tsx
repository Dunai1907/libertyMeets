import React, { useState } from "react";
import Image from "next/image";
import { getSession, signIn } from "next-auth/react";
import { Button, Form, Input, message } from "antd";
import Link from "next/link";
import styles from "./Login.module.scss";
import { useRouter } from "next/router";

export default function Login() {
  const [isRemember, setIsRemember] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  const error = () => {
    messageApi.open({
      type: "error",
      content: "Invalid credentials",
      duration: 2.5,
      style: {
        marginTop: "10vh",
      },
    });
  };

  async function onFinish(values: any) {
    try {
      values.rememberMe = isRemember;
      await signIn("credentials", {
        ...values,
        redirect: false,
      });
      const session = await getSession();
      session?.email && router.push("/auth/activate");
      session?.user && router.push("/posts");
      session?.user === undefined && error();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
      <div className={styles.error}>{contextHolder}</div>
      <section className={styles.loginWrapper}>
        <div className={styles.formBlock}>
          <div className={styles.logoInfo}>
            <div className={styles.goods}>
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
              label="E-mail"
              labelCol={{ span: 3 }}
              className={styles.username}
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
                placeholder="Username"
                className={styles.usernameInput}
              />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              colon={false}
              labelCol={{ span: 3 }}
              labelAlign="left"
              className={styles.password}
              rules={[{ required: true }, { type: "string", min: 4, max: 100 }]}
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
            <div className={styles.box}>
              <label className={styles.container}>
                <span className={styles.checkboxText}>Remember me</span>
                <input
                  type="checkbox"
                  className={styles.checkHighload}
                  onClick={() => setIsRemember(!isRemember)}
                />
                <span className={styles.highload2}></span>
              </label>
              <Link className={styles.forgot} href="/reset-password">
                Forgot password
              </Link>
            </div>
            <Form.Item className={styles.logIn}>
              <Button
                type="primary"
                htmlType="submit"
                className={styles.buttonLogIns}
              >
                <Image
                  src="/decor/login.svg"
                  alt=""
                  width={20}
                  height={20}
                  className={styles.vector}
                />
                <span className={styles.buttonLogInsText}>Log in</span>
              </Button>
            </Form.Item>
          </Form>
          <Link className={styles.dontHave} href="/registration">
            Don’t have an account yet?{" "}
          </Link>
          <Link className={styles.signUp} href={"/registration"}>
            Sign Up For Free!
          </Link>
        </div>
      </section>
    </>
  );
}
