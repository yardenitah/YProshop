// client/src/components/Message.jsx
import React from "react";
import { Alert } from "react-bootstrap";

// variant means if its danger its will be red and if we want to be success which would be green and...
// children means whatever we wrapping it.

const Message = ({ variant, children }) => {
  return <Alert variant={variant}>{children}</Alert>;
};

Message.defaultProps = {
  variant: "info",
};

export default Message;
