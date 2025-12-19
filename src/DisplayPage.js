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
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(data);
    });
    return () => unsubscribe();
  }, []);

  // 將資料分成兩組 (Row 1 和 Row 2)
  const row1Posts = posts.filter((_, index) => index % 2 === 0);
  const row2Posts = posts.filter((_, index) => index % 2 !== 0);

  // 用來渲染單個卡片的組件 (避免重複寫程式碼)
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
          style={{ backgroundColor: post.noteColor || "#ffeb3b" }} // 使用資料庫存的顏色，如果沒有就用黃色
        >
          {post.content}
          <div className="item-tag">@{post.nickname}</div>
        </div>
      )}
    </div>
  );
  // ...前面的 import 和邏輯都不用動...

  return (
    <div className="flow-container">
      {/* ⭐ 新增這裡：懸浮標題 */}
      <h1 className="page-title">大家眼中的中山大學👀</h1>

      {/* 第一排：由右往左流動 */}
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

      {/* 第二排：由左往右流動 */}
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
    </div>
  );
}
