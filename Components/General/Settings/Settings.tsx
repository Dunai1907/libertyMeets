import { Button, Form, Input, Modal } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import styles from "./Settings.module.scss";
import Image from "next/image";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { signOut } from "next-auth/react";
import Navigation from "../MyProfileNavigation/Navigation";
import { PASSWORD_VALIDATION_PATTERN } from "../../../utils/stringUtils";

type ErrorResponse = {
  message: string;
};
type SettingsProps = { appUrl: string; activePage: string };

export default function Settings(props: SettingsProps) {
  const appUrl = props.appUrl;
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isUpdatedPassword, setIsUpdatedPassword] = useState<boolean>();

  const { confirm } = Modal;

  const showDeleteConfirm = () => {
    confirm({
      title: "Are you sure you want to delete your account?",
      icon: <QuestionCircleOutlined />,
      content: "All your posts will also be deleted",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteAccount();
      },
    });
  };

  async function onFinish(values: any) {
    if (values.password !== values.repeatPassword) {
      setErrorMessage("repeat password");
      return;
    }

    try {
      const req = await axios.post(
        `${appUrl}/api/users/change-password`,
        values
      );
      if (req.status === 200) {
        setIsUpdatedPassword(true);
      }
    } catch (err) {
      const error = err as AxiosError;
      const response = error.response;
      setErrorMessage((response?.data as ErrorResponse).message);
    }
  }

  async function deleteAccount() {
    try {
      const res = await axios.post(`${appUrl}/api/users/deleteAccount`);
      if (res.status === 200) {
        signOut({ callbackUrl: "/" });
      }
    } catch (err) {
      const error = err as AxiosError;
      const response = error.response;
      setErrorMessage((response?.data as ErrorResponse).message);
    }
  }

  return (
    <section className={styles.profileWrapper}>
      <Navigation activePage={props.activePage} />
      <div className={styles.wrap}>
        <div className={styles.container}>
          <span className={styles.userTitle}>User Details</span>
          {isUpdatedPassword ? (
            <div>Your password was updated successfully.</div>
          ) : (
            <div>{errorMessage}</div>
          )}

          <Form
            name="settings"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            className={styles.form}
          >
            <Form.Item
              name="password"
              label="Password"
              colon={false}
              labelCol={{ span: 3 }}
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
              hasFeedback
            >
              <Input.Password className={styles.input} />
            </Form.Item>

            <Form.Item
              name="repeatPassword"
              label="Confirm Password"
              dependencies={["password"]}
              hasFeedback
              colon={false}
              labelCol={{ span: 3 }}
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
              <Input.Password className={styles.input} />
            </Form.Item>
            <Form.Item>
              <div className={styles.buttonBlock}>
                <Button className={styles.btn} htmlType="submit">
                  <Image
                    src="/decor/preview.svg"
                    alt=""
                    width={16}
                    height={14}
                    className={styles.vector}
                  />
                  <span className={styles.save}>Save Changes</span>
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
        <div className={styles.deleteBlock}>
          <Button className={styles.btnDelete}>
            <Image
              src="/decor/delete.svg"
              alt=""
              width={14}
              height={16}
              className={styles.vector}
            />
            <span className={styles.deleteText} onClick={showDeleteConfirm}>
              Delete Account?
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
}
