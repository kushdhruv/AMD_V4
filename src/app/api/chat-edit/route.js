
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request) {
  try {
    const { message, currentBlueprint } = await request.json();

    if (!message || !currentBlueprint) {
      return Response.json(
        { error: "Missing message or blueprint" },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are an expert AI website builder.
Your task is to modify a Website Blueprint (JSON) based on the user's Natural Language Instruction.

Rules:
1. Parse the provided 'current_blueprint' JSON.
2. Interpret the 'instruction' to understand what needs to change.
3. Apply the changes to the blueprint.
4. Output specific JSON structure: { "blueprint": <FULL_UPDATED_JSON>, "message": "<SHORT_CONFIRMATION_TEXT>" }.
5. Do NOT change fields that are not related to the instruction.
6. Ensure the JSON is valid.
7. Return ONLY the JSON object. Do not wrap in markdown code blocks.

Example:
User: "Change the hero background to red."
Output: { "blueprint": { ... "hero": { "background_style": "red" } ... }, "message": "I've changed the hero background to red." }`,
        },
        {
          role: "user",
          content: `Current Blueprint: ${JSON.stringify(currentBlueprint)}

Instruction: ${message}`,
        },
      ],
      temperature: 0.1, // Low temp for precision
      max_tokens: 4096,
      response_format: { type: "json_object" }, // Enforce JSON
    });

    const responseContent = completion.choices[0]?.message?.content?.trim();
    if (!responseContent) throw new Error("No response from AI");

    const result = JSON.parse(responseContent);

    return Response.json(result);
  } catch (error) {
    console.error("Chat edit error:", error);
    return Response.json(
      { error: "Failed to update website: " + error.message },
      { status: 500 }
    );
  }
}
