import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, List, Avatar } from "antd";
import axios from "axios";
import SideVideos from "./Sections/SideVideos";
import Subscribe from "./Sections/Subscribe";

function VideoDetailPage() {
  const { videoId } = useParams();
  const variable = { videoId };

  const [videoDetails, setVideoDetails] = useState([]);
  useEffect(() => {
    axios.post("/api/video/getVideoDetails", variable).then((res) => {
      if (res.data.success) {
        setVideoDetails(res.data.videoDetail);
        console.log(videoDetails);
      } else {
        alert("비디오 정보를 가져오는 데 실패했습니다.");
      }
    });
  }, [videoId]);

  return (
    <>
      {videoDetails.writer ? (
        <Row>
          <Col lg={16} xs={24}>
            <div style={{ width: "100%", padding: "3rem 4rem" }}>
              <video
                style={{ width: "100%" }}
                src={`http://localhost:5000/${videoDetails.filePath}`}
                controls
              />

              <List.Item
                actions={[
                  <Subscribe
                    userTo={videoDetails.writer._id}
                    userFrom={localStorage.getItem("userId")}
                  />,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={videoDetails.writer.image} />}
                  title={videoDetails.title}
                  description={videoDetails.description}
                />
              </List.Item>

              {/* Comments */}
            </div>
          </Col>
          <Col lg={6} xs={24}>
            <SideVideos />
          </Col>
        </Row>
      ) : (
        <div>...loading</div>
      )}
    </>
  );
}

export default VideoDetailPage;
