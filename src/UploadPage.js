import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, storage } from "./firebase";
import "./styles.css";

// 定義一組好看的便利貼顏色 (粉彩系)
const NOTE_COLORS = [
  "#ffeb3b", // 黃
  "#ff80ab", // 粉紅
  "#80d8ff", // 藍
  "#b9f6ca", // 綠
  "#ea80fc", // 紫
  "#ff9e80", // 橘
];

export default function UploadPage() {
  const [type, setType] = useState("image");
  const [file, setFile] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [nickname, setNickname] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (type === "image" && !file) return alert("請選擇照片！");
    if (type === "note" && !noteText.trim()) return alert("請寫下內容！");

    setUploading(true);
    try {
      let content = "";
      let noteColor = null; // 預設沒有顏色

      if (type === "image") {
        const fileRef = ref(storage, `exhibition/${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        content = await getDownloadURL(fileRef);
      } else {
        content = noteText;
        // 如果是便利貼，隨機選一個顏色
        noteColor = NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)];
      }

      await addDoc(collection(db, "posts"), {
        type: type,
        content: content,
        nickname: nickname || "神秘觀展人",
        noteColor: noteColor, // 儲存顏色
        createdAt: serverTimestamp(),
      });

      alert("上傳成功！");
      setFile(null);
      setNoteText("");
      setNickname("");
    } catch (error) {
      console.error(error);
      alert("上傳失敗：" + error.message);
    }
    setUploading(false);
  };

  return (
    <div className="upload-wrapper">
      <div className="upload-card">
        <h2 className="title">✨ 上傳展覽內容</h2>

        <div className="tab-group">
          <button
            className={`tab-btn ${type === "image" ? "active" : ""}`}
            onClick={() => setType("image")}
          >
            📸 照片
          </button>
          <button
            className={`tab-btn ${type === "note" ? "active" : ""}`}
            onClick={() => setType("note")}
          >
            📝 便利貼
          </button>
        </div>

        <input
          className="styled-input"
          type="text"
          placeholder="你的暱稱"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />

        {type === "image" ? (
          <input
            className="file-input"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
        ) : (
          <textarea
            className="styled-textarea"
            placeholder="寫下你的想法..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            style={{ backgroundColor: "#fff9c4" }} // 輸入框稍微變黃提示這是便利貼
          />
        )}

        <button
          className="upload-btn"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? "傳送中..." : "發布到大螢幕"}
        </button>
      </div>
    </div>
  );
}
