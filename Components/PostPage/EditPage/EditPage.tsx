import Image from "next/image";
import { Button, Form, Input, Select } from "antd";
import { useRouter } from "next/router";
import axios from "axios";
import styles from "./EditPage.module.scss";
import { useEffect } from "react";

const { TextArea } = Input;

type EditPostProps = { appUrl: string; post: PostType };
type PostType = {
  id: number;
  author_id: number;
  title: string;
  geo: string;
  created_at: Date;
  category: string;
  description: string;
  is_public: boolean;
};

export default function EditPage(props: EditPostProps) {
  const appUrl = props.appUrl;
  const router = useRouter();
  const postPageId = props.post.id;
  const fromUrl = router.query.fromUrl;
  useEffect(() => {}, []);

  async function onFinish(values: any) {
    values.id = postPageId;
    const req = await axios.post(`${appUrl}/api/posts/edit`, values, {
      withCredentials: true,
    });
    if (req.status === 200) {
      router.push(`/posts/${postPageId}/?fromUrl=${fromUrl}`);
    }
  }

  return (
    <section className={styles.container}>
      <div className={styles.arrow}>
        <Button
          className={styles.arrowBtn}
          type="link"
          onClick={() =>
            router.push(`/posts/${postPageId}/?fromUrl=${fromUrl}`)
          }
        >
          <Image
            src="/decor/arrow-left.svg"
            alt=""
            width={45}
            height={42}
            className={styles.vector}
          />
          <span className={styles.backBtn}>Back</span>
        </Button>
      </div>
      <div className={styles.editContainer}>
        <Form name="normal_login" onFinish={onFinish}>
          <div className={styles.title}>Edit Post</div>
          <div className={styles.inputContainer}>
            <div className={styles.postTitle}>
              <Form.Item
                className={styles.postTitleText}
                labelAlign={"left"}
                labelCol={{ span: 2 }}
                label="Post Title"
                name="title"
                colon={false}
                initialValue={props.post.title}
                rules={[
                  { required: false },
                  { type: "string", min: 4, max: 90 },
                ]}
              >
                <Input
                  suffix={
                    <Image
                      src="/decor/editPensil.svg"
                      alt=""
                      width={18}
                      height={30}
                    />
                  }
                  className={styles.postTitleInput}
                />
              </Form.Item>
            </div>
            <div className={styles.category}>
              <Form.Item
                className={styles.categoryText}
                labelAlign={"left"}
                labelCol={{ span: 2 }}
                label="Category"
                name="category"
                initialValue={props.post.category}
                colon={false}
              >
                <Select className={styles.categorySelect}>
                  <Select.Option
                    className={styles.categorySelectOption}
                    value="Social"
                  >
                    Social
                  </Select.Option>
                  <Select.Option
                    className={styles.categorySelectOption}
                    value="Volunteer"
                  >
                    Volunteer
                  </Select.Option>
                  <Select.Option
                    className={styles.categorySelectOption}
                    value="Professional"
                  >
                    Professional
                  </Select.Option>
                  <Select.Option
                    className={styles.categorySelectOption}
                    value="Campaigns"
                  >
                    Сampaigns
                  </Select.Option>
                </Select>
              </Form.Item>
            </div>
            <div className={styles.description}>
              <Form.Item
                className={styles.descriptionText}
                labelAlign={"left"}
                labelCol={{ span: 2 }}
                label="Description"
                name="description"
                colon={false}
                initialValue={props.post.description}
                rules={[{ required: false }, { type: "string", max: 1000 }]}
              >
                <TextArea
                  maxLength={1000}
                  autoSize={{ minRows: 7, maxRows: 7 }}
                  showCount={true}
                  rows={7}
                  size={"small"}
                  className={styles.descriptionTextarea}
                />
              </Form.Item>
            </div>
          </div>
          <div className={styles.buttonBlock}>
            <Button className={styles.cancel} onClick={() => history.back()}>
              <Image src="/decor/x.svg" alt="" width={10} height={10} />
              <span className={styles.cancelBtn}>Cancel</span>
            </Button>
            <Form.Item>
              <Button className={styles.edit} htmlType="submit">
                <span className={styles.editBtn}>Save</span>
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </section>
  );
}
