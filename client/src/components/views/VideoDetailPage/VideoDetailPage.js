import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, List, Avatar } from "antd";
import axios from "axios";

function VideoDetailPage() {
  const { videoId } = useParams();
  const variable = { videoId };

  const [videoDetails, setVideoDetails] = useState([]);
  useEffect(() => {
    axios.post("/api/video/getVideoDetails", variable).then((res) => {
      if (res.data.success) {
        console.log(res.data);
        setVideoDetails(res.data.videoDetail);
        console.log(videoDetails);
      } else {
        alert("비디오 정보를 가져오는 데 실패했습니다.");
      }
    });
  }, []);

  return (
    // <div>hello!2</div>
    <>
      {videoDetails.writer ? (
        <Row gutter={[16, 16]}>
          <Col lg={18} xs={24}>
            <div style={{ width: "100%", padding: "3rem 4rem" }}>
              <video
                style={{ width: "100%" }}
                src={`http://localhost:5000/${videoDetails.filePath}`}
                controls
              />

              <List.Item actions>
                <List.Item.Meta
                  avatar={<Avatar src={videoDetails.writer.image} />}
                  title={videoDetails.writer.name}
                  description={videoDetails.description}
                />
              </List.Item>

              {/* Comments */}
            </div>
          </Col>
          <Col lg={6} xs={24}>
            Side Videos
          </Col>
        </Row>
      ) : (
        <div>...loading</div>
      )}
    </>
  );
}

export default VideoDetailPage;
