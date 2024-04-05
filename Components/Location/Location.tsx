import { useEffect, useState } from "react";
import { PostType } from "../../types/general";
import styles from "./Location.module.scss";

type LocationProps = {
  post: PostType;
};

export default function Location(props: LocationProps) {
  const { post } = props;
  const [location, setLocation] = useState<string>("");
  useEffect(() => {
    if (post.location_name) {
      setLocation(post.location_name);
      return;
    }
    if (post.city && post.state) {
      setLocation(`${post.city}, ${post.state}`);
    }
  }, [post.location_name, post.city, post.state]);

  return <div className={styles.location}>{location}</div>;
}
