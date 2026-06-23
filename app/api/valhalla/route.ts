import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // .env üzerinden API URL'sini alıyoruz
  const apiUrl = process.env.NEXT_PUBLIC_VALHALLA_API_URL || "http://63.176.164.179:8002";
  const url = `${apiUrl}/route`;

  try {
    const body = await request.text();
    
    // Sunucudan (backend) istek atıyoruz (Böylece CORS hatası olmaz)
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": request.headers.get("Content-Type") || "application/json",
      },
      body,
    });

    const data = await response.text();

    return new NextResponse(data, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
