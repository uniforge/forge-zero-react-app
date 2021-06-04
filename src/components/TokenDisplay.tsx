import { Typography, Row, Col } from "antd";
import { BeachCard } from "./BeachCard";
import { NullBeachCard } from "./NullBeachCard";
import { Token } from "../types";
import { useState } from "react";

const { Text } = Typography;

export function TokenDisplay(props: {
  tokens: Array<Token>;
  imgUrilBase: string;
  ascending?: boolean;
}) {
  const [asc, setAsc] = useState<boolean>(false);

  if (props.ascending !== undefined) {
    setAsc(props.ascending);
  }

  return (
    <Row gutter={[{ xs: 0, sm: 16 }, 16]}>
      {props.tokens
        .filter((token) => token.id !== 0)
        .sort((a, b) => {
          return asc ? a.id - b.id : b.id - a.id;
        })
        .map((token) => {
          return (
            <Col xs={20} sm={16} md={12} lg={8} xl={6} key={token.id}>
              <BeachCard
                token={token}
                imgUri={
                  props.imgUrilBase + String(token.id).padStart(9, "0") + ".png"
                }
              />
            </Col>
          );
        })}
      {props.tokens
        .filter((token) => token.id === 0)
        .sort((a, b) => {
          return asc ? a.id - b.id : b.id - a.id;
        })
        .map((token, index) => {
          return (
            <Col xs={20} sm={16} md={12} lg={8} xl={6} key={-1 * index}>
              <NullBeachCard />
            </Col>
          );
        })}
    </Row>
  );
}
