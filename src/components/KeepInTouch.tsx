import { Button, Modal, Form, Input, Space, Typography, Row, Col } from "antd";
import { useForm, ValidationError } from "@formspree/react";

const { Text } = Typography;

export function KeepInTouch(props: {
  isVisibile: boolean;
  handleOk: any;
  handleCancel: any;
}) {
  const [form] = Form.useForm();
  const [state, handleSubmit] = useForm("meqvgygq");
  if (state.succeeded) {
    console.log("Success");
    props.handleOk();
  }
  return (
    <>
      <Modal
        title="Mainnet Beta Launch Notification"
        visible={props.isVisibile}
        onOk={handleSubmit}
        onCancel={props.handleCancel}
        footer={[]}
      >
        <Text>Sign up to be notified of our launch on Mainnet Beta.</Text>
        <form onSubmit={handleSubmit}>
          <Row>
            <Space>
              <Col>
                <label htmlFor="email">Email Address</label>
              </Col>
              <Col>
                <input
                  style={{ width: "100%" }}
                  id="email"
                  type="email"
                  name="email"
                  placeholder="gimli@gloinson.com"
                />
                <ValidationError
                  prefix="Email"
                  field="email"
                  errors={state.errors}
                />
              </Col>
            </Space>
          </Row>
          <Row>
            <button type="submit" disabled={state.submitting}>
              Submit
            </button>
          </Row>
        </form>
      </Modal>
    </>
  );
}
