import React, { useState } from "react";
import { Typography, Button, Form, message, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import Dropzone from "react-dropzone";
import { useSelector } from "react-redux";

const { Title } = Typography;
const { TextArea } = Input;

const privateOptions = [
  { value: 0, label: "Private" },
  { value: 1, label: "Public" },
];

const categoryOptions = [
  { value: 0, label: "Film & Animation" },
  { value: 1, label: "Autos & Vehicles" },
  { value: 2, label: "Music" },
  { value: 3, label: "Pets & Animals" },
];

const ViedoUploadPage = ({ history }) => {
  const user = useSelector((state) => state.user.userData); // 리덕스를 이용해 user 정보를 모두 가져옴
  const [viedoTitle, setVideoTitle] = useState("");
  const [description, setDescription] = useState("");
  const [privateOption, setPrivateOption] = useState(0); // public일땐 1
  const [category, setCategory] = useState("Film & Animation");
  const [filePath, setFilePath] = useState("");
  const [duration, setDuration] = useState("");
  const [thumbnailPath, setThumbnailPath] = useState("");

  const onTitleChange = (e) => {
    setVideoTitle(e.currentTarget.value);
  };

  const onDescriptionChange = (e) => {
    setDescription(e.currentTarget.value);
  };

  const onPrivateChange = (e) => {
    setPrivateOption(e.currentTarget.value);
  };

  const onCategoryChange = (e) => {
    setCategory(e.currentTarget.value);
  };

  const onDrop = (files) => {
    let formData = new FormData();
    let config = {
      header: { "content-type": "multipart/form-data" },
    };
    formData.append("file", files[0]);
    console.log(files);
    axios
      .post("/api/video/uploadfiles", formData, config) //
      .then((res) => {
        if (res.data.success) {
          console.log(res.data);
          let variable = {
            url: res.data.url,
            fileName: res.data.fileName,
          };

          setFilePath(res.data.url);

          axios
            .post("/api/video/thumbnail", variable) // variable을 서버에 보내준 뒤
            .then((res) => {
              if (res.data.success) {
                setDuration(res.data.fileDuration);
                setThumbnailPath(res.data.thumbsFilePath);
                console.log(thumbnailPath);
                console.log(res.data);
              } else {
                alert("썸네일 등록에 실패했습니다.");
              }
            });
        } else {
          alert("비디오 업로드를 실패했습니다.");
        }
      });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const variables = {
      writer: user._id,
      title: viedoTitle,
      description,
      privacy: privateOption,
      filePath,
      category,
      duration,
      thumbnail: thumbnailPath,
    };

    axios.post("/api/video/uploadVideo", variables).then((res) => {
      if (res.data.success) {
        message.success("성공적으로 업로드 했습니다");
        setTimeout(() => {
          history.push("/");
        }, 3000);
      } else {
        alert("비디오 업로드에 실패했습니다.");
      }
    });
  };

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Title level={2}>Upload Video</Title>
      </div>
      <Form onSubmit={onSubmit}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/* Drop Zone */}
          <Dropzone onDrop={onDrop} multiple={false} maxSize={100000000}>
            {({ getRootProps, getInputProps }) => (
              <div
                style={{
                  width: "300px",
                  height: "240px",
                  border: "1px solid lightgray",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <PlusOutlined style={{ fontSize: "3rem" }} />
              </div>
            )}
          </Dropzone>
          {/* Thumbnail */}
          {thumbnailPath && (
            <div>
              <img src={`http://localhost:5000/${thumbnailPath}`} alt="thumbnail" />
            </div>
          )}
        </div>
        <br />
        <br />
        <label>Title</label>
        <Input onChange={onTitleChange} value={viedoTitle} />
        <br />
        <br />
        <label>Description</label>
        <TextArea onChange={onDescriptionChange} value={description} />
        <br />
        <br />
        <select onChange={onPrivateChange}>
          {privateOptions.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />
        <select onChange={onCategoryChange}>
          {categoryOptions.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />
        <Button type="primary" size="large" onClick={onSubmit}>
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default ViedoUploadPage;
