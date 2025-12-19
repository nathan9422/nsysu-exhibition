import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UploadPage from "./UploadPage";
import DisplayPage from "./DisplayPage";
import "./styles.css"; // 如果你有這個檔案，保留它；沒有也沒關係

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 手機開啟首頁 -> 上傳頁 */}
        <Route path="/" element={<UploadPage />} />

        {/* 大螢幕開啟 /display -> 展示頁 */}
        <Route path="/display" element={<DisplayPage />} />
      </Routes>
    </BrowserRouter>
  );
}
