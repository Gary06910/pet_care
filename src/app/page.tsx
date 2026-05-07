"use client";

import Image from "next/image";
import type { FormEvent, ReactNode } from "react";
import { useMemo, useState } from "react";

type IconName =
  | "paw"
  | "calendar"
  | "arrow"
  | "cloud"
  | "scissors"
  | "drop"
  | "truck"
  | "check"
  | "pin"
  | "phone"
  | "wechat"
  | "clock";

const navLinks = [
  { href: "#services", label: "服务" },
  { href: "#process", label: "流程" },
  { href: "#prices", label: "价格" },
  { href: "#booking", label: "预约" },
  { href: "#visit", label: "门店" },
];

const services = [
  {
    icon: "cloud",
    tone: "bg-[var(--sage)]",
    title: "基础香浴",
    body: "低敏沐浴、吹干梳理、耳道清洁、脚底毛和肛门腺护理。",
    points: ["适合日常清洁", "可选幼宠温和款"],
  },
  {
    icon: "scissors",
    tone: "bg-[var(--coral)]",
    title: "造型精修",
    body: "根据品种、毛量和生活习惯设计修剪，兼顾好看与好打理。",
    points: ["泰迪、比熊、雪纳瑞", "局部修剪可单约"],
  },
  {
    icon: "drop",
    tone: "bg-[var(--amber)]",
    title: "皮毛 SPA",
    body: "保湿修护、蓬松护理、去浮毛和异味管理，适合换毛季。",
    points: ["长毛犬猫友好", "护理前先评估皮肤"],
  },
  {
    icon: "truck",
    tone: "bg-[var(--sage-deep)]",
    title: "接送服务",
    body: "3 公里内可约接送，护理完成后发送照片和状态反馈。",
    points: ["提前 2 小时预约", "专用透气运输箱"],
  },
] as const;

const processSteps = [
  {
    title: "到店评估",
    body: "确认皮肤、毛结、指甲、耳道和近期健康状态，记录禁忌和敏感点。",
  },
  {
    title: "分区清洁",
    body: "犬猫分区护理，洗护工具独立消毒，沐浴品按皮毛状态选择。",
  },
  {
    title: "吹干修整",
    body: "低噪吹水配合梳理，减少拉扯；需要造型时先沟通修剪长度。",
  },
  {
    title: "交付反馈",
    body: "护理后发送照片，说明皮肤、耳朵、毛结和下次护理建议。",
  },
];

const prices = [
  {
    title: "小型犬基础洗护",
    body: "适合 10kg 内短毛或常规毛量犬只。",
    price: "¥88",
    features: ["香浴吹干", "耳道、脚底、指甲", "基础梳理"],
  },
  {
    title: "猫咪温和洗护",
    body: "适合短毛猫、长毛猫和轻度换毛期护理。",
    price: "¥158",
    features: ["独立猫区", "低噪吹干", "去浮毛护理"],
  },
  {
    title: "造型美容套餐",
    body: "含洗护、全身修剪、脸型精修和护理反馈。",
    price: "¥198",
    features: ["造型沟通", "全身修剪", "护理后照片"],
  },
];

const reviews = [
  {
    body: "第一次来之前很担心猫咪应激，护理师先让它适应环境，洗完毛很蓬松，还提醒了耳朵护理。",
    avatar: "陈",
    name: "陈小姐",
    pet: "英短猫主人",
    tag: "猫咪洗护",
  },
  {
    body: "我家比熊以前剪脸总翻车，这次沟通得很细，修完很自然，回家也好打理。",
    avatar: "周",
    name: "周先生",
    pet: "比熊犬主人",
    tag: "造型精修",
  },
  {
    body: "接送很方便，洗护结束会发照片和问题反馈，适合上班日安排。",
    avatar: "林",
    name: "林女士",
    pet: "柯基犬主人",
    tag: "门店接送",
  },
  {
    body: "护理师会先检查皮肤和毛结，没有直接硬梳。我们家金毛洗完没有香精味，毛摸起来很干净。",
    avatar: "吴",
    name: "吴女士",
    pet: "金毛犬主人",
    tag: "基础香浴",
  },
  {
    body: "雪纳瑞嘴边毛容易打结，这次修得很利落，眼睛周围也清爽，拍照特别精神。",
    avatar: "赵",
    name: "赵先生",
    pet: "雪纳瑞主人",
    tag: "脸部修剪",
  },
  {
    body: "家里两只猫一起预约，工作人员分开安置，整个过程很安静。回家后没有躲起来，状态比预想好。",
    avatar: "黄",
    name: "黄小姐",
    pet: "双猫家庭",
    tag: "低应激护理",
  },
  {
    body: "预约时间很准，护理前后都会确认需求。泰迪腿型剪得匀称，下次会继续固定找这位护理师。",
    avatar: "刘",
    name: "刘女士",
    pet: "泰迪犬主人",
    tag: "固定护理师",
  },
  {
    body: "换毛季掉毛严重，做完去浮毛护理后家里轻松很多。护理建议写得很清楚，能直接照着做。",
    avatar: "孙",
    name: "孙先生",
    pet: "萨摩耶主人",
    tag: "皮毛 SPA",
  },
];

function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  const common = "fill-none";

  if (name === "paw") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path
          d="M8.5 10.2c1.1 0 2-1.3 2-2.9s-.9-2.9-2-2.9-2 1.3-2 2.9.9 2.9 2 2.9Zm7 0c1.1 0 2-1.3 2-2.9s-.9-2.9-2-2.9-2 1.3-2 2.9.9 2.9 2 2.9ZM5.8 14.3c1 0 1.8-1.1 1.8-2.4s-.8-2.4-1.8-2.4S4 10.6 4 11.9s.8 2.4 1.8 2.4Zm12.4 0c1 0 1.8-1.1 1.8-2.4s-.8-2.4-1.8-2.4-1.8 1.1-1.8 2.4.8 2.4 1.8 2.4ZM12 11.8c-2.3 0-5.2 2.7-5.2 5.3 0 1.6 1.1 2.5 2.5 2.5 1 0 1.7-.5 2.7-.5s1.7.5 2.7.5c1.4 0 2.5-.9 2.5-2.5 0-2.6-2.9-5.3-5.2-5.3Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  const paths: Record<Exclude<IconName, "paw">, ReactNode> = {
    calendar: (
      <path
        d="M8 2v4M16 2v4M4 9h16M5 5h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    ),
    arrow: (
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    cloud: (
      <>
        <path
          d="M7 14c-2 0-3.5-1.6-3.5-3.5S5 7 7 7c.5-2 2.3-3.5 4.5-3.5S15.5 5 16 7h1c2 0 3.5 1.6 3.5 3.5S19 14 17 14H7Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M8 18h8M10 21h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    scissors: (
      <path
        d="m14.5 4.5 5 5M4 20l4.8-1.1L19.7 8a2.1 2.1 0 0 0-3-3L5.9 15.9 4 20Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    ),
    drop: (
      <>
        <path d="M12 3c3 3.2 6 6.4 6 10a6 6 0 0 1-12 0c0-3.6 3-6.8 6-10Z" stroke="currentColor" strokeWidth="2" />
        <path d="M9 14c.6 1.6 1.6 2.4 3 2.4s2.4-.8 3-2.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    truck: (
      <>
        <path d="M4 7h10v10H4zM14 10h3l3 3v4h-6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM17 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke="currentColor" strokeWidth="2" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
    pin: (
      <>
        <path d="M12 21s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12Z" stroke="currentColor" strokeWidth="2" />
        <path d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" stroke="currentColor" strokeWidth="2" />
      </>
    ),
    phone: (
      <path
        d="M22 16.9v3a2 2 0 0 1-2.2 2 19.7 19.7 0 0 1-8.6-3.1 19.3 19.3 0 0 1-6-6A19.7 19.7 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    ),
    wechat: (
      <>
        <path d="M8.6 17.4 5 19l.8-3.1A6.7 6.7 0 0 1 3 10.6C3 6.9 6.6 4 11 4s8 2.9 8 6.6-3.6 6.6-8 6.6c-.8 0-1.6-.1-2.4-.4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M8.2 9.4h.1M13.7 9.4h.1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </>
    ),
    clock: <path d="M12 6v6l4 2M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />,
  };

  return (
    <svg viewBox="0 0 24 24" className={`${common} ${className}`} aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
}) {
  const classes =
    variant === "primary"
      ? "bg-[var(--coral)] text-white shadow-[0_12px_24px_rgba(232,111,81,0.24)] hover:bg-[#d95f43]"
      : "bg-white text-[var(--sage-deep)] shadow-[inset_0_0_0_1px_var(--line)] hover:bg-[#fffdf8]";

  return (
    <a
      href={href}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-[18px] font-bold transition ${classes}`}
    >
      {children}
    </a>
  );
}

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const minDate = useMemo(() => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().slice(0, 10);
  }, []);
  const reviewLoopItems = useMemo(() => [...reviews, ...reviews], []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      pet: String(formData.get("pet") || "").trim(),
      service: String(formData.get("service") || "").trim(),
      date: String(formData.get("date") || "").trim(),
      time: String(formData.get("time") || "").trim(),
      note: String(formData.get("note") || "").trim(),
    };

    setIsSubmitting(true);
    setSubmitMessage("");
    setSubmitError("");

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || "预约提交失败，请稍后再试。");
      }

      setSubmitMessage(`${payload.name}，${payload.service}预约已提交，店员会尽快联系您确认档期。`);
      form.reset();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "预约提交失败，请稍后再试。");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-[rgba(38,49,45,0.1)] bg-[rgba(255,250,242,0.92)] backdrop-blur-[18px]">
        <nav className="mx-auto flex min-h-[72px] w-[min(1180px,calc(100%_-_40px))] items-center justify-between gap-6 max-[980px]:w-[min(calc(100%_-_28px),760px)] max-[620px]:min-h-16" aria-label="主导航">
          <a className="inline-flex items-center gap-2.5 whitespace-nowrap text-xl font-extrabold text-[var(--sage-deep)] max-[620px]:text-lg" href="#top" aria-label="沐爪宠物洗护首页">
            <span className="grid size-[38px] place-items-center rounded-lg bg-[var(--sage-deep)] text-white">
              <Icon name="paw" className="size-6" />
            </span>
            沐爪宠物洗护
          </a>
          <div className="flex items-center gap-2 text-sm text-[var(--muted)] max-[980px]:hidden">
            {navLinks.map((link) => (
              <a key={link.href} className="rounded-lg px-3 py-2.5 transition hover:bg-[rgba(111,144,120,0.12)] hover:text-[var(--sage-deep)]" href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
          <a className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[var(--coral)] px-[18px] font-bold text-white shadow-[0_12px_24px_rgba(232,111,81,0.24)] transition hover:bg-[#d95f43] max-[620px]:min-h-10 max-[620px]:px-3 max-[620px]:text-sm" href="#booking">
            <Icon name="calendar" className="size-[18px]" />
            立即预约
          </a>
        </nav>
      </header>

      <main id="top">
        <section
          className="relative mx-auto mb-10 grid min-h-[calc(100svh-128px)] w-[min(1180px,calc(100%_-_40px))] items-center overflow-hidden rounded-b-lg bg-cover bg-center after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-[34%] after:bg-gradient-to-t after:from-[rgba(255,250,242,0.72)] after:to-transparent max-[980px]:min-h-[calc(100svh-120px)] max-[980px]:w-[min(calc(100%_-_28px),760px)] max-[980px]:bg-[position:61%_center] max-[620px]:mb-6 max-[620px]:min-h-0"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(255,250,242,0.96) 0%, rgba(255,250,242,0.82) 36%, rgba(255,250,242,0.04) 62%), url('/assets/hero-pet-spa.png')",
          }}
          aria-label="沐爪宠物洗护"
        >
          <div className="relative z-10 w-[min(560px,100%)] px-0 py-[72px] pl-14 max-[980px]:px-[22px] max-[980px]:pb-[270px] max-[980px]:pt-12 max-[620px]:px-[18px] max-[620px]:pb-[220px] max-[620px]:pt-[38px]">
            <p className="mb-[18px] text-sm font-extrabold text-[var(--coral)]">犬猫分区 · 预约到店 · 可接送</p>
            <h1 className="mb-[18px] text-[clamp(40px,6vw,72px)] leading-[1.02] font-black text-[var(--sage-deep)] max-[620px]:text-[42px]">
              把毛孩子洗得干净，也照顾它的情绪。
            </h1>
            <p className="mb-[30px] max-w-[500px] text-lg leading-[1.8] text-[#40504b] max-[620px]:text-base">
              从基础洗澡到精修造型，使用低敏洗护品、可视化护理流程和一宠一巾消毒规范，让每次洗护都更安心。
            </p>
            <div className="mb-[30px] flex flex-wrap gap-3">
              <ButtonLink href="#booking">
                <Icon name="arrow" className="size-[18px]" />
                预约洗护
              </ButtonLink>
              <ButtonLink href="#prices" variant="secondary">
                查看价目
              </ButtonLink>
            </div>
            <div className="grid max-w-[520px] grid-cols-3 gap-3 max-[620px]:grid-cols-1" aria-label="服务承诺">
              {[
                ["45-90 分钟", "按体型安排护理时长"],
                ["1 对 1", "护理师全程负责"],
                ["8 项", "基础清洁检查"],
              ].map(([value, label]) => (
                <div key={value} className="min-h-[74px] border-l-[3px] border-[var(--amber)] bg-[rgba(255,255,255,0.74)] p-3.5 backdrop-blur-lg">
                  <strong className="mb-1 block text-xl text-[var(--sage-deep)]">{value}</strong>
                  <span className="text-[13px] text-[var(--muted)]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-[72px] max-[620px]:py-[52px]" id="services">
          <div className="mx-auto w-[min(1180px,calc(100%_-_40px))] max-[980px]:w-[min(calc(100%_-_28px),760px)]">
            <SectionHead
              title="常用洗护服务"
              body="按宠物状态选择项目，洗澡、剪毛、开结、皮毛护理和接送都能在预约时一起安排。"
            />
            <div className="grid grid-cols-4 gap-4 max-[980px]:grid-cols-1">
              {services.map((service) => (
                <article key={service.title} className="flex min-h-[250px] flex-col justify-between rounded-lg border border-[var(--line)] bg-white p-6 shadow-[0_12px_28px_rgba(38,49,45,0.06)] max-[620px]:p-[22px]">
                  <div>
                    <span className={`grid size-[46px] place-items-center rounded-lg text-white ${service.tone}`} aria-hidden="true">
                      <Icon name={service.icon} className="size-6" />
                    </span>
                    <h3 className="mt-[22px] mb-2.5 text-xl font-bold text-[var(--ink)]">{service.title}</h3>
                    <p className="leading-[1.75] text-[var(--muted)]">{service.body}</p>
                  </div>
                  <ul className="mt-[18px] grid gap-2 text-sm text-[#40504b]">
                    {service.points.map((point) => (
                      <li key={point} className="flex items-center gap-2">
                        <span className="size-1.5 shrink-0 rounded-full bg-[var(--coral)]" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[var(--mint)] py-[72px] max-[620px]:py-[52px]" id="process">
          <div className="mx-auto w-[min(1180px,calc(100%_-_40px))] max-[980px]:w-[min(calc(100%_-_28px),760px)]">
            <SectionHead
              title="到店洗护流程"
              body="流程公开、节奏温和，护理师会根据宠物性格调整吹水、修剪和休息间隔。"
            />
            <div className="grid grid-cols-[1.1fr_0.9fr] items-stretch gap-7 max-[980px]:grid-cols-1">
              <div className="grid gap-3">
                {processSteps.map((step, index) => (
                  <article key={step.title} className="grid min-h-[98px] grid-cols-[56px_1fr] items-start gap-[18px] border-b border-[rgba(55,92,73,0.18)] bg-[rgba(255,255,255,0.56)] p-5 max-[620px]:grid-cols-[46px_1fr] max-[620px]:bg-transparent max-[620px]:px-0 max-[620px]:py-[18px]">
                    <span className="grid size-11 place-items-center rounded-lg bg-[var(--sage-deep)] font-extrabold text-white">{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="mb-1.5 text-lg font-bold">{step.title}</h3>
                      <p className="mb-0 leading-[1.7] text-[var(--muted)]">{step.body}</p>
                    </div>
                  </article>
                ))}
              </div>
              <aside className="min-h-full rounded-lg bg-[linear-gradient(160deg,rgba(55,92,73,0.96),rgba(38,49,45,0.96)),radial-gradient(circle_at_85%_20%,rgba(240,179,91,0.36),transparent_34%)] p-[34px] text-white max-[620px]:p-[22px]">
                <h3 className="mb-[18px] text-[28px] leading-[1.2] font-bold">不赶时间，先让宠物稳定下来。</h3>
                <p className="leading-[1.85] text-[rgba(255,255,255,0.78)]">
                  容易紧张、年纪较大或第一次到店的宠物，会优先安排低刺激时段。必要时拆分项目，避免一次护理过久。
                </p>
                <dl className="mt-[26px] grid gap-3.5">
                  {[
                    ["营业时间", "10:00 - 20:30"],
                    ["建议预约", "提前 1 天"],
                    ["护理空间", "犬猫分区"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4 border-b border-[rgba(255,255,255,0.18)] pb-3.5">
                      <dt className="text-[rgba(255,255,255,0.72)]">{label}</dt>
                      <dd className="m-0 font-extrabold">{value}</dd>
                    </div>
                  ))}
                </dl>
              </aside>
            </div>
          </div>
        </section>

        <section className="py-[72px] max-[620px]:py-[52px]" id="prices">
          <div className="mx-auto w-[min(1180px,calc(100%_-_40px))] max-[980px]:w-[min(calc(100%_-_28px),760px)]">
            <SectionHead
              title="透明价格"
              body="最终价格会根据体型、毛量、毛结和配合度确认，预约时可先估价。"
            />
            <div className="grid grid-cols-3 gap-4 max-[980px]:grid-cols-1">
              {prices.map((item) => (
                <article key={item.title} className="rounded-lg border border-[var(--line)] bg-white p-[26px] shadow-[0_12px_28px_rgba(38,49,45,0.06)] max-[620px]:p-[22px]">
                  <h3 className="mt-0 mb-2.5 text-xl font-bold text-[var(--ink)]">{item.title}</h3>
                  <p className="leading-[1.75] text-[var(--muted)]">{item.body}</p>
                  <div className="my-[22px] text-[40px] leading-none font-black text-[var(--sage-deep)]">
                    {item.price} <small className="text-sm font-semibold text-[var(--muted)]">起</small>
                  </div>
                  <ul className="grid gap-3 text-[#40504b]">
                    {item.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[var(--sage)] text-[13px] leading-none text-white">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[var(--mint)] py-[72px] max-[620px]:py-[52px]" id="booking">
          <div className="mx-auto w-[min(1180px,calc(100%_-_40px))] max-[980px]:w-[min(calc(100%_-_28px),760px)]">
            <SectionHead
              title="在线预约"
              body="提交后店员会在营业时间内联系确认档期、项目和预估费用。"
            />
            <div className="grid grid-cols-[0.95fr_1.05fr] items-start gap-5 max-[980px]:grid-cols-1">
              <div className="rounded-lg border border-[var(--line)] bg-white p-[30px] shadow-[0_12px_28px_rgba(38,49,45,0.06)] max-[620px]:p-[22px]">
                <form className="grid grid-cols-2 gap-3.5 max-[620px]:grid-cols-1" id="bookingForm" onSubmit={handleSubmit}>
                  <Field label="您的称呼" htmlFor="name">
                    <input className={inputClassName} id="name" name="name" type="text" placeholder="例如：李女士" required />
                  </Field>
                  <Field label="联系电话" htmlFor="phone">
                    <input className={inputClassName} id="phone" name="phone" type="tel" placeholder="手机号码" required />
                  </Field>
                  <Field label="宠物类型" htmlFor="pet">
                    <select className={inputClassName} id="pet" name="pet" required defaultValue="">
                      <option value="">请选择</option>
                      <option>小型犬</option>
                      <option>中大型犬</option>
                      <option>猫咪</option>
                      <option>其他</option>
                    </select>
                  </Field>
                  <Field label="预约项目" htmlFor="service">
                    <select className={inputClassName} id="service" name="service" required defaultValue="">
                      <option value="">请选择</option>
                      <option>基础香浴</option>
                      <option>造型精修</option>
                      <option>皮毛 SPA</option>
                      <option>接送服务</option>
                    </select>
                  </Field>
                  <Field label="到店日期" htmlFor="date">
                    <input className={inputClassName} id="date" name="date" type="date" min={minDate} required />
                  </Field>
                  <Field label="期望时段" htmlFor="time">
                    <select className={inputClassName} id="time" name="time" required defaultValue="">
                      <option value="">请选择</option>
                      <option>10:00 - 12:00</option>
                      <option>12:00 - 15:00</option>
                      <option>15:00 - 18:00</option>
                      <option>18:00 - 20:30</option>
                    </select>
                  </Field>
                  <Field label="宠物情况" htmlFor="note" full>
                    <textarea className={`${inputClassName} min-h-[116px] resize-y pt-3`} id="note" name="note" placeholder="例如：8kg 柯基，怕吹水，有轻微毛结" />
                  </Field>
                  <div className="col-span-full grid gap-3">
                    <button
                      className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border-0 bg-[var(--coral)] px-[18px] font-bold text-white shadow-[0_12px_24px_rgba(232,111,81,0.24)] transition hover:bg-[#d95f43] disabled:cursor-not-allowed disabled:opacity-70"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      <Icon name="check" className="size-[18px]" />
                      {isSubmitting ? "提交中..." : "提交预约"}
                    </button>
                    <p
                      className={`m-0 text-[13px] leading-[1.7] ${
                        submitError ? "text-[var(--coral)]" : submitMessage ? "text-[var(--sage-deep)]" : "text-[var(--muted)]"
                      }`}
                      aria-live="polite"
                    >
                      {submitError || submitMessage || "提交后店员会在营业时间内联系确认档期、项目和预估费用。"}
                    </p>
                  </div>
                </form>
              </div>
              <aside className="rounded-lg border border-[var(--line)] bg-[var(--sage-deep)] p-[30px] text-white shadow-[0_12px_28px_rgba(38,49,45,0.06)] max-[620px]:p-[22px]" id="visit">
                <h3 className="mt-0 text-[28px] font-bold">门店信息</h3>
                <ul className="my-6 grid gap-[18px]">
                  <VisitItem icon="pin">上海市徐汇区梧桐路 88 号 1F，近地铁 9 号线</VisitItem>
                  <VisitItem icon="phone">电话：021-6626-8899</VisitItem>
                  <VisitItem icon="wechat">微信：MuzhuaCare</VisitItem>
                  <VisitItem icon="clock">周一至周日 10:00 - 20:30，节假日建议提前预约</VisitItem>
                </ul>
                <Image
                  className="mt-5 aspect-[16/9] w-full rounded-lg border border-[rgba(255,255,255,0.28)] object-cover shadow-[0_16px_28px_rgba(20,34,29,0.18)]"
                  src="/assets/store-location-map.png"
                  width={1672}
                  height={941}
                  alt="沐爪宠物洗护门店位置地图，地址为上海市徐汇区梧桐路 88 号 1F，近地铁 9 号线"
                />
              </aside>
            </div>
          </div>
        </section>

        <section className="py-[72px] max-[620px]:py-[52px]">
          <div className="mx-auto w-[min(1180px,calc(100%_-_40px))] max-[980px]:w-[min(calc(100%_-_28px),760px)]">
            <SectionHead
              title="顾客评价"
              body="来自犬猫家庭的真实洗护体验，覆盖洗澡、造型、接送和低应激护理。"
            />
            <div
              className="review-carousel relative overflow-hidden rounded-lg border border-[var(--line)] bg-[rgba(255,255,255,0.56)] py-2 shadow-[0_16px_34px_rgba(38,49,45,0.07)]"
              aria-label="顾客评价轮播"
            >
              <div className="reviews-marquee flex w-max gap-4 py-4 pl-4 max-[620px]:gap-3 max-[620px]:pl-3">
                {reviewLoopItems.map((review, index) => (
                  <article
                    key={`${review.name}-${index}`}
                    aria-hidden={index >= reviews.length}
                    className="flex h-[238px] w-[360px] flex-col justify-between rounded-lg border border-[var(--line)] bg-white p-6 shadow-[0_12px_28px_rgba(38,49,45,0.06)] max-[620px]:h-auto max-[620px]:min-h-[232px] max-[620px]:w-[min(78vw,320px)] max-[620px]:p-[22px]"
                  >
                    <div>
                      <div className="mb-4 flex items-center justify-between gap-4">
                        <span className="rounded-full bg-[var(--mint)] px-3 py-1 text-xs font-bold text-[var(--sage-deep)]">{review.tag}</span>
                        <span className="text-sm tracking-[2px] text-[var(--amber)]" aria-label="五星评价">
                          ★★★★★
                        </span>
                      </div>
                      <p className="m-0 leading-[1.75] text-[var(--muted)]">“{review.body}”</p>
                    </div>
                    <div className="mt-[22px] flex items-center gap-3">
                      <span className="grid size-[42px] shrink-0 place-items-center rounded-lg bg-[var(--coral)] font-extrabold text-white">{review.avatar}</span>
                      <div>
                        <strong className="block">{review.name}</strong>
                        <span className="text-[13px] text-[var(--muted)]">{review.pet}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#1f2a26] py-[34px] text-[rgba(255,255,255,0.72)]">
        <div className="mx-auto flex w-[min(1180px,calc(100%_-_40px))] flex-wrap justify-between gap-[18px] max-[620px]:grid">
          <span>
            <strong className="text-white">沐爪宠物洗护</strong> · 专业犬猫洗护美容
          </span>
          <span>© 2026 Muzhua Pet Care. All rights reserved.</span>
        </div>
      </footer>
    </>
  );
}

const inputClassName =
  "min-h-[46px] w-full rounded-lg border border-[var(--line)] bg-[#fffdf8] px-3.5 text-[var(--ink)] outline-none transition focus:border-[var(--sage)] focus:shadow-[0_0_0_4px_rgba(111,144,120,0.14)]";

function SectionHead({ title, body }: { title: string; body: string }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-7 max-[980px]:block">
      <h2 className="mb-0 text-[clamp(28px,4vw,44px)] leading-[1.12] font-extrabold text-[var(--sage-deep)]">{title}</h2>
      <p className="mb-0 max-w-[440px] leading-[1.8] text-[var(--muted)] max-[980px]:mt-3.5">{body}</p>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
  full = false,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
  full?: boolean;
}) {
  return (
    <div className={`grid gap-2 ${full ? "col-span-full" : ""}`}>
      <label className="text-sm font-extrabold text-[var(--sage-deep)]" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
    </div>
  );
}

function VisitItem({ icon, children }: { icon: IconName; children: ReactNode }) {
  return (
    <li className="grid grid-cols-[26px_1fr] gap-3 leading-[1.7] text-[rgba(255,255,255,0.82)]">
      <Icon name={icon} className="size-[22px] text-[var(--amber)]" />
      <span>{children}</span>
    </li>
  );
}
