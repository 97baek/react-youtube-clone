import React, { useEffect, useState } from "react";
import axios from "axios";

function Subscribe({ userTo }) {
  const [subscribeNumber, setSubscribeNumber] = useState(0);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const variable = { userTo };
    axios
      .post("/api/subscribe/subscribeNumber", variable) //
      .then((res) => {
        if (res.data.success) {
          setSubscribeNumber(res.data.subscribeNumber);
        } else {
          alert("구독자 수 정보를 받아오지 못했습니다.");
        }
      });

    const subscribedVariable = { userTo, userFrom: localStorage.getItem("userId") };
    axios
      .post("/api/subscribe/subscribed", subscribedVariable) //
      .then((res) => {
        if (res.data.success) {
          setSubscribed(res.data.subscribed);
        } else {
          alert("구독 정보를 받아오지 못했습니다.");
        }
      });
  });

  return (
    <div>
      <button
        style={{
          backgroundColor: `${subscribed ? "#aaaaaa" : "#cc0000"}`,
          border: "none",
          borderRadius: "4px",
          color: "white",
          padding: "10px 16px",
          fontWeight: "500",
          fontSize: "1rem",
          textTransform: "uppercase",
        }}
        onClick
      >
        {subscribeNumber} {subscribed ? "SUBSCRIBED" : "SUBSCRIBE"}
      </button>
    </div>
  );
}

export default Subscribe;