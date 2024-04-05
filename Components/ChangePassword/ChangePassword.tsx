import React from "react";
import Image from "next/image";
import { Button, Form, Input } from "antd";
import { useRouter } from "next/router";
import styles from "./ChangePassword.module.scss";
import axios from "axios";
import { useEffect, useState } from "react";
import { PASSWORD_VALIDATION_PATTERN } from "../../utils/stringUtils";

type ChangePasswordProps = { appUrl: string };

export default function ChangePassword({ appUrl }: ChangePasswordProps) {
  const [isPasswordsEqual, setIsPasswordsEqual] = useState<boolean>(true);

  const router = useRouter();
  useEffect(() => {
    (async () => {
      const req = await axios.post(`${appUrl}/api/users/verification`, {
        token: router.query.token,
      });
      if (req.status !== 200) {
        router.push("/reset-password/expired-token");
      }
    })();
  }, [appUrl, router]);

  useEffect(() => {
    setTimeout(() => {
      setIsPasswordsEqual(true);
    }, 10_000);
  });

  async function onFinish(values: any) {
    if (values.password !== values.repeatPassword) {
      setIsPasswordsEqual(false);
      return;
    }

    const valuesForResetToken = {
      password: values.password,
      token: router.query.token,
    };

    const res = await axios.post(
      `${appUrl}/api/users/set-password`,
      valuesForResetToken
    );
    if (res.status === 200) {
      router.push("/signin");
    } else {
      router.push("/reset-password/expired-token");
    }
  }

  return (
    <>
      <section className={styles.changeWrapper}>
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
              label="Password"
              name="password"
              colon={false}
              labelCol={{ span: 4 }}
              labelAlign="left"
              className={styles.password}
              rules={[
                {
                  required: true,
                  message: "Please input your new password!",
                },
                {
                  max: 100,
                  pattern: PASSWORD_VALIDATION_PATTERN,
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

            <Form.Item
              label="Password"
              name="repeatPassword"
              colon={false}
              labelCol={{ span: 4 }}
              labelAlign="left"
              className={styles.password}
              rules={[
                { required: true, message: "Please repeat your password!" },
                {
                  max: 100,
                  pattern: PASSWORD_VALIDATION_PATTERN,
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
                <span className={styles.buttonLogInsText}>Reset</span>
              </Button>
            </Form.Item>
            {isPasswordsEqual ||
              "The new passwords you have entered do not match. Please ensure that both the new password and repeat password fields contain the same text, then try again. If you continue to have trouble, please reach out to our support team for assistance."}
          </Form>
        </div>
      </section>
    </>
  );
}
