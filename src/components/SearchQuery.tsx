import { useHistory, generatePath } from "react-router-dom";
import { Input, notification } from "antd";
import { useForge } from "../contexts/ForgeProvider";
import { LABELS } from "../constants";
import { useState } from "react";

const { Search } = Input;

export function SearchQuery(props: { maxTokenId?: number }) {
  let history = useHistory();
  const { forge } = useForge();

  const handleSearch = (value: string, event: any) => {
    console.log(event);
    if (value !== "") {
      if (value.length === 44) {
        // Assume query is a pubkey
        const newPath = generatePath("/listAccount/:publickey", {
          publickey: value,
        });

        history.push(newPath);
      } else {
        // Assume it is a token id, do some basic checks
        if (isNaN(Number(value))) {
          notification.error({
            message: "Invalid query",
            description:
              "Try a Solana wallet address or a " +
              LABELS.TOKEN_NAME +
              " number",
          });
        } else {
          // Valid max token
          try {
            //@ts-ignore
            const validMaxToken = forge?.maxSupply - forge?.supplyUnclaimed;

            if (Number(value) <= validMaxToken && Number(value) > 0) {
              const newPath = generatePath("/tokenDetail/:tokenId", {
                tokenId: value,
              });

              history.push(newPath);
            } else {
              notification.error({
                message: "Invalid " + LABELS.TOKEN_NAME,
                description:
                  "Only " +
                  validMaxToken +
                  " " +
                  LABELS.TOKEN_NAME +
                  " have been forged",
              });
            }
          } catch {
            notification.error({
              message: "Invalid query",
              description:
                "Try a Solana wallet address or a " +
                LABELS.TOKEN_NAME +
                " number",
            });
          }
        }
      }
    }
  };

  return (
    <Search
      placeholder={"Search by " + LABELS.TOKEN_NAME + " number or public key"}
      onSearch={handleSearch}
      enterButton
      style={{ width: 500 }}
    />
  );
}
