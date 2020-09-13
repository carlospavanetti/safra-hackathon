import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { LoadingOutlined } from "@ant-design/icons";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => router.push("/chat"), 3000);
  }, []);

  return (
    <div className="splash-page">
      <img className="avatar" src="sofia.png" />
      <h1 className="tagline">Sofia</h1>
      <p className="subtagline">A sua assistente financeira</p>
      <LoadingOutlined className="spinner" />
    </div>
  );
}
