// client/src/components/SearchBox.jsx
import React from "react";
import { IoIosSearch } from "react-icons/io";
import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword || "");

  const submitHandler = (e) => {
    e.preventDefault();
    // The trim() method is used to remove whitespace characters (spaces, tabs, and newlines) from both ends of a string.
    if (keyword.trim()) {
      setKeyword("");
      // This condition checks if the trimmed version of the keyword string is not an empty
      navigate(`/search/${keyword}`);
    } else {
      navigate("/");
    }
  };

  return (
    <Form onSubmit={submitHandler} className="d-flex px-3">
      <Form.Control
        className="mr-ms-2 ml-sm-5"
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder="Search Products..."
      ></Form.Control>
      <Button type="submit" variant="outline-light" className="p-2 mx-2 d-flex">
        Search
        <IoIosSearch className="mt-1 " />
      </Button>
    </Form>
  );
};

export default SearchBox;
