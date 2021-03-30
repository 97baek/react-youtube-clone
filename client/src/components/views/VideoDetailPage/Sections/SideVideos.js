import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
function SideVideos() {
  const [sideVideos, setSideVideos] = useState([]);
  useEffect(() => {
    axios.get("/api/video/getVideos").then((res) => {
      if (res.data.success) {
        console.log(res.data);
        setSideVideos(res.data.videos);
      } else {
        alert("비디오 가져오기를 실패했습니다.");
      }
    });
  }, []);

  const renderSideVideo = sideVideos.map((video, index) => {
    let minutes = Math.floor(video.duration / 60);
    let seconds = Math.floor(video.duration - minutes * 60);
    return (
      <div key={index} style={{ display: "flex", marginBottom: "1rem", padding: "0 2rem" }}>
        <div style={{ width: "40%", marginRight: "1rem" }}>
          <Link to={`/video/${video._id}`}>
            <img
              style={{ width: "100%", height: "100%" }}
              src={`http://localhost:5000/${video.thumbnail}`}
              alt="썸네일"
            />
          </Link>
        </div>
        <div style={{ width: "50%" }}>
          <Link to style={{ color: "gray" }}>
            <span style={{ fontSize: "1rem", color: "black" }}>{video.title}</span>
            <br />
            <span>{video.writer.name}</span>
            <br />
            <span>{video.views} views</span>
            <br />
            <span>
              {minutes} : {seconds}
            </span>
            <br />
          </Link>
        </div>
      </div>
    );
  });

  return <div style={{ marginTop: "3rem" }}>{renderSideVideo}</div>;
}

export default SideVideos;
