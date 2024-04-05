import Image from "next/image";
import { Button, Form, Input, Select, Switch, Tooltip, message } from "antd";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import axios from "axios";
import RememberBlock from "../RememberBlock/RememberBlock";
import styles from "./CreatePost.module.scss";
import Link from "next/link";
import { Location } from "../../services/geocodeSearch";
import getLocations from "../../services/geocodeSearch";
import { Spiner } from "../General/Spiner/Spiner";

const { TextArea } = Input;

type CreatePostProps = { appUrl: string };

export default function CreatePost(props: CreatePostProps) {
  const { appUrl } = props;
  const { data: session } = useSession();
  const [lat, setLat] = useState<number>(0);
  const [lng, setLng] = useState<number>(0);
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [postalCode, setPostalCode] = useState<string>("");
  const [messageApi, contextHolder] = message.useMessage();
  const [geocodeResult, setGeocodeResult] = useState<Location[] | undefined>(
    []
  );
  const postalRegex = new RegExp("^[0-9]{5}(?:-[0-9]{4})?$");
  const router = useRouter();

  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        loading: () => <Spiner />,
        ssr: false,
      }),
    []
  );

  const error = (text: string | { code: any; message: any }) => {
    messageApi.open({
      type: "error",
      content: typeof text === "string" ? text : text.message,
      duration: 2.5,
      style: {
        marginTop: "10vh",
      },
    });
  };

  function fillLocationData(values: any, location: Location | undefined) {
    if (!location) {
      return values;
    }
    values.city =
      location.address_components.find((component) =>
        component.types.includes("locality")
      )?.long_name || null;
    const route =
      location.address_components.find((components) =>
        components.types.includes("route")
      )?.long_name || null;
    const street_number =
      location.address_components.find((components) =>
        components.types.includes("street_number")
      )?.long_name || null;
    if (street_number === undefined || route === undefined) {
      values.street = `${street_number} ${route}`;
    }

    values.state =
      location.address_components.find((component) =>
        component.types.includes("administrative_area_level_1")
      )?.long_name || null;

    return values;
  }

  async function onFinish(values: any) {
    try {
      values.lat = lat;
      values.lng = lng;
      values.is_public = isPublic;

      if (!geocodeResult) {
        return;
      }

      fillLocationData(values, geocodeResult[0]);
      const res = await axios.post(`${appUrl}/api/posts/create`, values, {
        withCredentials: true,
      });

      if (res.status === 200) {
        router.push("/myPosts");
      }
    } catch (e) {
      console.error(e);
      error(
        "It looks like there was a problem while trying to create your post"
      );
    }
  }

  useEffect(() => {
    if (postalCode) {
      getLocations(postalCode)
        .then((result) => {
          setGeocodeResult(result?.locations);
          if (result) {
            setLat(result.locations[0].geometry.location.lat);
            setLng(result.locations[0].geometry.location.lng);
          }
        })
        .catch((e) => {
          console.error(e);
          error("Sorry, but we were unable to detect location.");
        });
    } else {
      setLat(Number(session?.user.lat));
      setLng(Number(session?.user.lng));
    }
  }, [postalCode, session?.user]);

  return (
    <section className={styles.container}>
      <div className={styles.error}>{contextHolder}</div>
      <div className={styles.arrow}>
        <Link className={styles.backLink} href={""}>
          <Button
            className={styles.arrowBtn}
            type="link"
            onClick={() => history.back()}
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
        </Link>
      </div>
      <div className={styles.createContainer}>
        <Form
          name="normal_login"
          onFinish={onFinish}
          initialValues={{ remember: true }}
        >
          <div className={styles.title}>Create Post</div>
          <div className={styles.inputContainer}>
            <div className={styles.postTitle}>
              <Form.Item
                className={styles.postTitleText}
                labelAlign={"left"}
                labelCol={{ span: 2 }}
                label="Post Title"
                name="title"
                colon={false}
                rules={[
                  { required: true },
                  { type: "string", min: 4, max: 90 },
                ]}
              >
                <Input
                  placeholder="Your Title"
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
                colon={false}
                rules={[{ required: true }]}
              >
                <Select
                  className={styles.categorySelect}
                  placeholder="Please select the group for your post"
                >
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
                rules={[
                  { required: true },
                  { type: "string", min: 4, max: 1000 },
                ]}
              >
                <TextArea
                  maxLength={1000}
                  autoSize={{ minRows: 7, maxRows: 7 }}
                  showCount={true}
                  rows={7}
                  size={"small"}
                  className={styles.descriptionTextarea}
                  placeholder="Describe your listing in detail here"
                />
              </Form.Item>
            </div>
          </div>
          <div className={styles.mapContainer}>
            <Form.Item className={styles.locationContainer}>
              <Form.Item
                label="City or neighborhood"
                name="location_name"
                colon={true}
                className={styles.city}
                rules={[
                  { required: false },
                  {
                    type: "string",
                    max: 100,
                  },
                ]}
              >
                <Input className={styles.cityInput} />
              </Form.Item>
              <Form.Item
                label="Postal code"
                name="zip"
                colon={false}
                className={styles.zipCode}
                rules={[
                  { required: true },
                  {
                    type: "string",
                    pattern: postalRegex,
                    message:
                      "Invalid postal code. Please enter a valid US postal code",
                  },
                  {
                    validator: async (_, value) => {
                      const geocodeResult = await getLocations(value);
                      const locations = geocodeResult?.locations;
                      if (locations && locations.length === 1) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        "Value not found in geocode result"
                      );
                    },
                  },
                ]}
                help={geocodeResult?.map((result) => result.formatted_address)}
              >
                <Input
                  className={styles.zipCodeInput}
                  onChange={(event) => setPostalCode(event.target.value)}
                />
              </Form.Item>
            </Form.Item>
            <div className={styles.location}>
              <div className={styles.map}>
                <Map
                  appUrl={appUrl}
                  userLat={session?.user.lat}
                  userLng={session?.user.lng}
                  lat={lat}
                  lng={lng}
                />
              </div>
            </div>
          </div>
          <div className={styles.buttonBlock}>
            <Button
              className={styles.cancel}
              onClick={() => router.push("/posts")}
            >
              <Image src="/decor/x.svg" alt="" width={10} height={10} />
              <span className={styles.cancelBtn}>Cancel</span>
            </Button>
            <Form.Item>
              <Button className={styles.preview} htmlType="submit">
                {/* <Image src="/decor/eyes.svg" alt="" width={16} height={14} /> */}
                <span className={styles.previewBtn}>Create Post</span>
              </Button>
            </Form.Item>
          </div>
          <div className={styles.remember}>
            <RememberBlock />
          </div>
        </Form>
      </div>
    </section>
  );
}
