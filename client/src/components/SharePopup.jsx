// client/src/components/SharePopup.jsx
import React, { useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { Row, Col, FormControl, Button } from "react-bootstrap";
import { Form } from "react-router-dom";
import {
  TwitterShareButton,
  FacebookShareButton,
  WhatsappShareButton,
} from "react-share";
import { TwitterIcon, FacebookIcon, WhatsappIcon } from "react-share";

const SharePopup = ({ product }) => {
  const currentSharePageUrl = window.location.href;
  const shareTitle = product.name;
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(currentSharePageUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2500);

        console.log("URL copied to clipboard");
      })
      .catch((error) => {
        console.error("Error copying to clipboard:", error);
      });
  };

  return (
    <div>
      <h3>Share this product:</h3>
      <Row>
        <Col md={6} className="pb-2">
          <TwitterShareButton
            url={currentSharePageUrl}
            title={shareTitle}
            hashtags={["proshop"]}
          >
            <TwitterIcon size={32} round />
          </TwitterShareButton>

          <FacebookShareButton
            className="mx-4 my-2"
            url={currentSharePageUrl}
            quote={shareTitle}
          >
            <FacebookIcon size={32} round />
          </FacebookShareButton>

          <WhatsappShareButton url={currentSharePageUrl} title={shareTitle}>
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
        </Col>

        <Col md={12}>
          <Form>
            <Row>
              <Col md={9}>
                <FormControl
                  type="text"
                  placeholder={currentSharePageUrl}
                  value={currentSharePageUrl}
                ></FormControl>
              </Col>
              <Col>
                <Button className="btn" onClick={handleCopyClick}>
                  {copied ? <AiOutlineCheck /> : "Copy"}
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default SharePopup;
