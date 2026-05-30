import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const url = new URL(req.url);

  // Reachability test endpoint
  if (url.pathname.endsWith("/ping") || req.method === "GET") {
    return new Response(
      JSON.stringify({ ok: true, message: "gemini-proxy is reachable", ts: Date.now() }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    let body: { apiKey?: unknown; prompt?: unknown };
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { apiKey, prompt } = body;

    if (!apiKey || typeof apiKey !== "string" || apiKey.trim() === "") {
      console.error("[gemini-proxy] Missing or empty apiKey");
      return new Response(
        JSON.stringify({ error: "apiKey is required and must be a non-empty string" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      console.error("[gemini-proxy] Missing or empty prompt");
      return new Response(
        JSON.stringify({ error: "prompt is required and must be a non-empty string" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[gemini-proxy] Calling Gemini API, prompt length=${prompt.length}`);

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    let geminiRes: Response;
    try {
      geminiRes = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 1024 },
        }),
      });
    } catch (fetchErr) {
      console.error("[gemini-proxy] fetch to Gemini failed:", fetchErr);
      return new Response(
        JSON.stringify({ error: "Network error reaching Gemini API", detail: String(fetchErr) }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const rawBody = await geminiRes.text();
    console.log(`[gemini-proxy] Gemini status=${geminiRes.status}, body_length=${rawBody.length}`);

    if (!geminiRes.ok) {
      console.error(`[gemini-proxy] Gemini error ${geminiRes.status}: ${rawBody.slice(0, 500)}`);
      let detail: unknown;
      try { detail = JSON.parse(rawBody); } catch { detail = rawBody; }
      return new Response(
        JSON.stringify({ error: `Gemini API returned ${geminiRes.status}`, detail }),
        { status: geminiRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let geminiData: unknown;
    try {
      geminiData = JSON.parse(rawBody);
    } catch {
      console.error("[gemini-proxy] Failed to parse Gemini JSON response");
      return new Response(
        JSON.stringify({ error: "Failed to parse Gemini response as JSON", raw: rawBody.slice(0, 500) }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const text: string =
      (geminiData as { candidates?: { content?: { parts?: { text?: string }[] } }[] })
        ?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    console.log(`[gemini-proxy] Success, text length=${text.length}`);

    return new Response(
      JSON.stringify({ text }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[gemini-proxy] Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Unexpected server error", detail: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
