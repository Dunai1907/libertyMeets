import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export function Spiner() {
  return <Spin indicator={antIcon} style={{ margin: "auto auto" }} />;
}
