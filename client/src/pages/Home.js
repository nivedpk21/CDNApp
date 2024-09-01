import React, { useEffect } from "react";
import "./home.css";
import axios from "axios";

export default function Home() {
  useEffect(() => {
    axios
      .get("http://localhost:4000/get-ip")
      .then((response) => {
        console.log(response);
        const url = response.data.data;
        if (url) {
          console.log(url);

          //window.location.href = url;
        }
      })
      .catch((error) => {
        console.log(error);  
        console.log(error.response.data.message);
      });
  }, []);
  return (
    <>
      <p>Redirecting...</p>
    </>
  );
}
