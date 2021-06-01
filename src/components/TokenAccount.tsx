import { Breadcrumb, Button, Layout, Typography } from "antd";
import { useTokenAccount } from "../contexts/TokenAccountProvider";
import { CreateAccount } from "./CreateAccount";

const { Title, Text } = Typography;

export function TokenAccount() {
  const { tokenAccount } = useTokenAccount();

  return (
    <div>
      {tokenAccount ? (
        <div>
          <Title level={4}>Holdings</Title>
          <Text>{"Number of tokens: " + tokenAccount.nTokens}</Text>
          <br />
          <Text>{JSON.stringify(tokenAccount.ownedTokens)}</Text>
          <br />
        </div>
      ) : (
        <div>
          <Text>You don't have a Forge account, yet.</Text>
          <br />
          <CreateAccount />
        </div>
      )}
    </div>
  );
}
