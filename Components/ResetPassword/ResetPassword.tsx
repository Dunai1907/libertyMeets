import React, { useState } from "react";
import Image from "next/image";
import { Button, Form, Input } from "antd";
import { useRouter } from "next/router";
import styles from "./ResetPassword.module.scss";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import ResetPasswodTextStatus from "../../pages/reset-password/reset-password-text-status";

type ResetPasswordProps = { appUrl: string };

export default function ResetPassword({ appUrl }: ResetPasswordProps) {
  const [resetEmailStatus, setResetEmailStatus] = useState<number>(200);
  const router = useRouter();

  async function onFinish(values: any) {
    try {
      const req = await axios.post(
        `${appUrl}/api/users/reset-password`,
        values
      );

      if (req.status === 200) {
        router.push("/reset-password/check-email");
      }
    } catch (err) {
      const error = err as AxiosError;
      const response = error.response;
      setResetEmailStatus(response?.status || 500);
    }
  }

  return (
    <section className={styles.resetPasswordWrapper}>
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
            labelCol={{ span: 4 }}
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

          <Form.Item className={styles.resetBtn}>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.buttonReset}
            >
              <Image
                src="/decor/reset.svg"
                alt=""
                width={14}
                height={16}
                className={styles.reset}
              />
              <span className={styles.resetText}>Reset Password</span>
            </Button>
          </Form.Item>
          <ResetPasswodTextStatus errCode={resetEmailStatus} />
        </Form>
        <Link className={styles.goBack} href={"/signin"}>
          Go Back to Log In
        </Link>
      </div>
    </section>
  );
}
