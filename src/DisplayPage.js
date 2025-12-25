import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  limit,
} from "firebase/firestore";
import { db } from "./firebase";
import "./styles.css";

export default function DisplayPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      limit(60)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(data);
    });
    return () => unsubscribe();
  }, []);

  const row1Posts = posts.filter((_, index) => index % 2 === 0);
  const row2Posts = posts.filter((_, index) => index % 2 !== 0);

  const CardItem = ({ post }) => (
    <div className="flow-item">
      {post.type === "image" ? (
        <>
          <img src={post.content} alt="exhibition" className="flow-img" />
          <div className="item-tag">@{post.nickname}</div>
        </>
      ) : (
        <div
          className="sticky-note-box"
          style={{ backgroundColor: post.noteColor || "#ffeb3b" }}
        >
          {post.content}
          <div className="item-tag">@{post.nickname}</div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flow-container">
      <h1 className="page-title">大家眼中的中山大學👀</h1>

      <div className="flow-track-wrapper">
        <div
          className="flow-track"
          style={{
            animation: `scroll-left ${Math.max(
              30,
              row1Posts.length * 5
            )}s linear infinite`,
          }}
        >
          {row1Posts.map((post) => (
            <CardItem key={post.id} post={post} />
          ))}
          {row1Posts.map((post) => (
            <CardItem key={`dup-${post.id}`} post={post} />
          ))}
        </div>
      </div>

      <div className="flow-track-wrapper">
        <div
          className="flow-track"
          style={{
            animation: `scroll-right ${Math.max(
              35,
              row2Posts.length * 6
            )}s linear infinite`,
          }}
        >
          {row2Posts.map((post) => (
            <CardItem key={post.id} post={post} />
          ))}
          {row2Posts.map((post) => (
            <CardItem key={`dup-${post.id}`} post={post} />
          ))}
        </div>
      </div>

      {/* ⭐ 新增：右下角浮動 QR Code 區塊 */}
      <div className="qr-code-container">
        <div className="qr-code-title">分享你的西灣美景</div>
        {/* ⚠️ 請將下方的 src 替換成您自己的 QR Code 圖片連結 */}
        <img
          src="https://i.postimg.cc/Qx7rTVJ8/adobe-express-qr-code.png"
          alt="掃描上傳"
          className="qr-code-img"
        />
      </div>
    </div>
  );
}
