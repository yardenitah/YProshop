// client/src/slices/apiSlice.js

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

//! apiSlice is the parent os all the slices
const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL });

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Products", "Order", "User"],
  endpoints: (builder) => ({}),
});
