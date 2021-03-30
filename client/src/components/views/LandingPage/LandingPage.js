import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Icon, Avatar, Col, Typography, Row } from "antd";
import axios from "axios";
import moment from "moment";
const { Title } = Typography;
const { Meta } = Card;

function LandingPage() {
  const [videos, setVideos] = useState([]);
  useEffect(() => {
    axios.get("/api/video/getVideos").then((res) => {
      if (res.data.success) {
        console.log(res.data);
        setVideos(res.data.videos);
      } else {
        alert("비디오 가져오기를 실패했습니다.");
      }
    });
  }, []);

  const renderCards = videos.map((video, index) => {
    let minutes = Math.floor(video.duration / 60);
    let seconds = Math.floor(video.duration - minutes * 60);

    return (
      <Col key={video._id} lg={6} md={8} xs={24}>
        <Link to={`/video/${video._id}`}>
          <div style={{ position: "relative" }}>
            <img
              src={`http://localhost:5000/${video.thumbnail}`}
              alt="썸네일"
              style={{ width: "100%", border: "1px solid #ccc" }}
            />
            <div className="duration">
              <span>
                {minutes} : {seconds}{" "}
              </span>
            </div>
          </div>
        </Link>
        <br />
        <Meta avatar={<Avatar src={video.writer.image} />} title={video.title} description="" />
        <span className="writer-name">{video.writer.name}</span>
        <br />
        <div className="views-and-date">
          <span className="views" style={{ marginLeft: "3rem" }}>
            {video.views} -{" "}
          </span>
          <span className="date">{moment(video.creteAt).format("MMM Do YY")}</span>
        </div>
      </Col>
    );
  });
  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
      <Title level={2}>
        Recommended
        <hr />
        <Row gutter={[32, 16]}>{renderCards}</Row>
      </Title>
    </div>
  );
}

export default LandingPage;
