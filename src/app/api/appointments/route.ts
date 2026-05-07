import { NextResponse } from "next/server";
import { Pool } from "pg";

export const runtime = "nodejs";

const allowedPetTypes = new Set(["小型犬", "中大型犬", "猫咪", "其他"]);
const allowedServices = new Set(["基础香浴", "造型精修", "皮毛 SPA", "接送服务"]);
const allowedTimeSlots = new Set([
  "10:00 - 12:00",
  "12:00 - 15:00",
  "15:00 - 18:00",
  "18:00 - 20:30",
]);

type BookingPayload = {
  name?: unknown;
  phone?: unknown;
  pet?: unknown;
  service?: unknown;
  date?: unknown;
  time?: unknown;
  note?: unknown;
};

type ValidBooking = {
  name: string;
  phone: string;
  pet: string;
  service: string;
  date: string;
  time: string;
  note: string | null;
};

declare global {
  // Keep one pool during local dev hot reloads instead of opening new pools.
  var appointmentsPool: Pool | undefined;
}

function getPool() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!globalThis.appointmentsPool) {
    globalThis.appointmentsPool = new Pool({
      connectionString,
      max: 5,
      ssl: { rejectUnauthorized: false },
    });
  }

  return globalThis.appointmentsPool;
}

function readText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function formatShanghaiDate(date: Date) {
  const parts = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

function validatePayload(payload: BookingPayload): ValidBooking | string {
  const name = readText(payload.name);
  const phone = readText(payload.phone);
  const pet = readText(payload.pet);
  const service = readText(payload.service);
  const date = readText(payload.date);
  const time = readText(payload.time);
  const note = readText(payload.note);

  if (!name || name.length > 40) {
    return "请填写 1-40 个字符的称呼。";
  }

  if (!/^[+\d\s-]{6,30}$/.test(phone)) {
    return "请填写有效的联系电话。";
  }

  if (!allowedPetTypes.has(pet)) {
    return "请选择有效的宠物类型。";
  }

  if (!allowedServices.has(service)) {
    return "请选择有效的预约项目。";
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return "请选择有效的到店日期。";
  }

  const visitDate = new Date(`${date}T00:00:00+08:00`);

  if (Number.isNaN(visitDate.getTime()) || formatShanghaiDate(visitDate) !== date) {
    return "请选择有效的到店日期。";
  }

  if (date < formatShanghaiDate(new Date())) {
    return "到店日期不能早于今天。";
  }

  if (!allowedTimeSlots.has(time)) {
    return "请选择有效的期望时段。";
  }

  if (note.length > 500) {
    return "宠物情况最多填写 500 个字符。";
  }

  return {
    name,
    phone,
    pet,
    service,
    date,
    time,
    note: note || null,
  };
}

export async function POST(request: Request) {
  let payload: BookingPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "请求内容不是有效的 JSON。" }, { status: 400 });
  }

  const booking = validatePayload(payload);

  if (typeof booking === "string") {
    return NextResponse.json({ error: booking }, { status: 400 });
  }

  try {
    const result = await getPool().query<{ id: string; created_at: string }>(
      `insert into public.appointments
        (customer_name, phone, pet_type, service, visit_date, time_slot, note)
       values ($1, $2, $3, $4, $5, $6, $7)
       returning id, created_at`,
      [booking.name, booking.phone, booking.pet, booking.service, booking.date, booking.time, booking.note],
    );

    return NextResponse.json(
      {
        id: result.rows[0].id,
        createdAt: result.rows[0].created_at,
        message: "预约已提交。",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create appointment", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error && error.message === "DATABASE_URL is not configured."
            ? "服务端数据库连接未配置，请设置 DATABASE_URL。"
            : "预约提交失败，请稍后再试或联系门店电话。",
      },
      { status: 500 },
    );
  }
}
