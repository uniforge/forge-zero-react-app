import { Breadcrumb, Button, Layout, Typography } from "antd";
import { useForge } from "../contexts/ForgeProvider";

const { Title, Text } = Typography;

export function Forge() {
  const { forge, getForge } = useForge();

  return (
    <div>
      <Title level={3}>Forge info:</Title>
      {forge ? (
        <div>
          <Text>{"Name: " + forge.name}</Text>
          <br />
          <Text>
            {forge.maxSupply - forge.supplyUnclaimed + " tokens claimed"}
          </Text>
        </div>
      ) : (
        "loading..."
      )}
      <br />
      <Button type="primary" onClick={getForge}>
        Refresh
      </Button>
    </div>
  );
}
