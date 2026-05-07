import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "沐爪宠物洗护 | 专业犬猫洗护美容",
  description:
    "沐爪宠物洗护提供犬猫洗澡、造型修剪、SPA护理、除结开毛、寄养前清洁和上门接送预约服务。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
