/**
 * Video Generator — Self-Contained Next.js API Route
 *
 * Ported from: Text_To_Video/backend/ (FastAPI + AnimateDiff worker)
 * - Prompt enhancement via Groq API (HTTP, no SDK needed)
 * - Video generation via Bytez API (replaces local AnimateDiff)
 * - In-memory task queue with polling (replaces SQLAlchemy + worker)
 *
 * NO separate Python server needed — runs entirely within Next.js.
 */
import { NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const BYTEZ_API_KEY = process.env.BYTEZ_API_KEY || "be7c4aa3d07ed4897bbbb7810eb79e83";

// Bytez text-to-video model
const VIDEO_MODEL_ID = "ali-vilab/text-to-video-ms-1.7b";
const BYTEZ_VIDEO_URL = `https://api.bytez.com/models/v2/${VIDEO_MODEL_ID}`;

// ---------------------------------------------------------------------------
// In-memory task queue (persists in dev mode, resets on server restart)
// ---------------------------------------------------------------------------
const tasks = new Map(); // taskId -> { id, status, prompt, enhancedPrompt, videoUrl, error, createdAt }
let taskCounter = 0;

// ---------------------------------------------------------------------------
// Groq API — Prompt Enhancement (ported from groq_handler.py)
// ---------------------------------------------------------------------------
async function enhancePrompt(prompt) {
    if (!GROQ_API_KEY) {
        // Fallback if no Groq key
        return `${prompt}, cinematic lighting, 8k resolution, photorealistic, highly detailed, professional cinematography`;
    }

    try {
        const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                temperature: 0.7,
                max_tokens: 200,
                messages: [
                    {
                        role: "system",
                        content:
                            "You are an expert AI Video Prompt Engineer. " +
                            "Your task is to take a simple user idea and rewrite it into a detailed, high-quality text-to-video prompt. " +
                            "Add details about lighting, camera angle, style (cinematic, photorealistic), and atmosphere. " +
                            "Keep the prompt under 4 sentences. " +
                            "Return ONLY the enhanced prompt, nothing else.",
                    },
                    {
                        role: "user",
                        content: `Enhance this video prompt: ${prompt}`,
                    },
                ],
            }),
            signal: AbortSignal.timeout(30000),
        });

        const data = await resp.json();
        if (data.choices?.[0]?.message?.content) {
            return data.choices[0].message.content.trim();
        }
    } catch (e) {
        console.error("[VideoGen] Groq enhancement failed:", e.message);
    }

    // Fallback
    return `${prompt}, cinematic lighting, 8k resolution, photorealistic, highly detailed, professional cinematography`;
}

// ---------------------------------------------------------------------------
// Bytez API — Video Generation (replaces local AnimateDiff worker)
// ---------------------------------------------------------------------------
async function generateVideo(prompt) {
    try {
        console.log(`[VideoGen] 🎬 Calling Bytez video API…`);
        const resp = await fetch(BYTEZ_VIDEO_URL, {
            method: "POST",
            headers: {
                "Authorization": BYTEZ_API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: prompt }),
            signal: AbortSignal.timeout(300000), // 5 minute timeout for video
        });

        const data = await resp.json();
        console.log(`[VideoGen] Response status=${resp.status}`);

        if (data.error) {
            return { videoUrl: null, error: String(data.error) };
        }

        // Extract video URL from response
        const output = data.output;
        let videoUrl = null;

        if (typeof output === "string") {
            videoUrl = output;
        } else if (output && typeof output === "object" && !Array.isArray(output)) {
            videoUrl = output.video || output.url || output.data || output.mp4;
            if (!videoUrl) {
                for (const v of Object.values(output)) {
                    if (typeof v === "string" && (v.includes("http") || v.includes(".mp4"))) {
                        videoUrl = v;
                        break;
                    }
                }
            }
        } else if (Array.isArray(output) && output.length > 0) {
            const first = output[0];
            videoUrl = typeof first === "string" ? first : (first?.video || first?.url);
        }

        if (videoUrl) return { videoUrl, error: null };

        return { videoUrl: null, error: `No video URL in response: ${JSON.stringify(output).slice(0, 300)}` };
    } catch (e) {
        console.error("[VideoGen] Bytez video API error:", e.message);
        return { videoUrl: null, error: e.message };
    }
}

// ---------------------------------------------------------------------------
// Background task processor (fire-and-forget async)
// ---------------------------------------------------------------------------
async function processTask(taskId) {
    const task = tasks.get(taskId);
    if (!task) return;

    try {
        // Step 1: Enhance prompt with Groq
        task.status = "processing";
        console.log(`[VideoGen] Processing task ${taskId}: enhancing prompt…`);
        const enhanced = await enhancePrompt(task.prompt);
        task.enhancedPrompt = enhanced;

        // Step 2: Generate video via Bytez
        console.log(`[VideoGen] Task ${taskId}: generating video…`);
        const { videoUrl, error } = await generateVideo(enhanced);

        if (error) {
            task.status = "failed";
            task.error = error;
            console.log(`[VideoGen] ❌ Task ${taskId} failed: ${error}`);
        } else {
            task.status = "completed";
            task.video_url = videoUrl;
            console.log(`[VideoGen] ✅ Task ${taskId} completed!`);
        }
    } catch (e) {
        task.status = "failed";
        task.error = e.message;
        console.error(`[VideoGen] ❌ Task ${taskId} error:`, e);
    }
}

// ---------------------------------------------------------------------------
// POST /api/generators/video — Create a video generation task
// ---------------------------------------------------------------------------
export async function POST(request) {
    try {
        const body = await request.json();
        const { prompt, duration } = body;

        if (!prompt?.trim()) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        const dur = parseInt(duration) || 5;
        if (![5, 10, 15, 30].includes(dur)) {
            return NextResponse.json({ error: "Duration must be 5, 10, 15, or 30" }, { status: 400 });
        }

        // Create task
        taskCounter++;
        const taskId = taskCounter;
        const task = {
            id: taskId,
            prompt: prompt.trim(),
            duration: dur,
            status: "pending",
            video_url: null,
            error: null,
            created_at: new Date().toISOString(),
        };
        tasks.set(taskId, task);

        // Fire-and-forget: start processing in background
        // This works because Next.js dev server is a long-lived Node.js process
        processTask(taskId).catch((e) => {
            console.error(`[VideoGen] Background task ${taskId} error:`, e);
            const t = tasks.get(taskId);
            if (t) { t.status = "failed"; t.error = e.message; }
        });

        return NextResponse.json({
            id: taskId,
            prompt: task.prompt,
            duration: task.duration,
            status: task.status,
            video_url: null,
            created_at: task.created_at,
        });
    } catch (err) {
        console.error("[VideoGen] POST error:", err);
        return NextResponse.json({ error: `Failed to create task: ${err.message}` }, { status: 500 });
    }
}

// ---------------------------------------------------------------------------
// GET /api/generators/video?taskId=X — Poll task status
// ---------------------------------------------------------------------------
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const taskId = parseInt(searchParams.get("taskId"));

    if (!taskId) {
        // Return all tasks (recent first)
        const all = Array.from(tasks.values())
            .sort((a, b) => b.id - a.id)
            .slice(0, 20);
        return NextResponse.json({ tasks: all });
    }

    const task = tasks.get(taskId);
    if (!task) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({
        id: task.id,
        prompt: task.prompt,
        duration: task.duration,
        status: task.status,
        video_url: task.video_url,
        error: task.error,
        created_at: task.created_at,
    });
}
