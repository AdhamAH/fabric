import type {APIRoute} from "astro";
import {openai} from "../util/openai.ts";

export const POST: APIRoute =async ({ request }) => {
    if (request.headers.get("Content-Type") === "application/json") {
        const body = await request.json();
        const stream = await openai.chat.completions.create({
            model:body.model||'gpt-3.5-turbo',
            messages: body.messages,
            stream:true,
        });
        const encoder = new TextEncoder();
        const streamBody = new ReadableStream({
            async start(controller) {
                for await (const chunk of stream) {
                    const content = chunk.choices[0]?.delta?.content ;
                    if (content) {
                        controller.enqueue(encoder.encode(content));
                    }
                }
                controller.close();
            }
        });

        return new Response(streamBody, {
            headers: { "Content-Type": "text/event-stream" }
        });
    }

    return new Response(null, { status: 400 });
};