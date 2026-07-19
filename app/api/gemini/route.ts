import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";
import { Type } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, payload } = body;

    const ai = getGeminiClient();

    let systemPrompt = "You are Nexora AI, the elite cognitive mentor on the Nexora Learn platform. Respond with clarity, encouraging gamification terms (XP, Coins, Streaks) where relevant, in highly formatted Markdown.";
    let userPrompt = "";

    switch (action) {
      case "chat": {
        const { messages, topic } = payload;
        systemPrompt = `You are Nexora AI, a friendly, hyper-personalized tutor for ${topic || "general studies"}. Keep answers engaging, brief, and educational. Add 1-2 interactive follow-up questions at the end to prompt the student.`;
        // Convert messages format
        const history = messages.slice(0, -1).map((m: any) => `${m.sender === "user" ? "Student" : "Nexora AI"}: ${m.text}`).join("\n");
        const latest = messages[messages.length - 1].text;
        userPrompt = `${history}\nStudent: ${latest}\nNexora AI:`;
        break;
      }
      case "doubt": {
        const { subject, query } = payload;
        systemPrompt = `You are the ultimate Doubt Solver on Nexora Learn. Break down the user's doubt in ${subject} step-by-step. Use analogies, clear definitions, and provide a quick 3-question review at the end to test understanding.`;
        userPrompt = `Doubt Query: "${query}"\nSolve this step-by-step:`;
        break;
      }
      case "summarize": {
        const { fileName, textContent } = payload;
        systemPrompt = `You are the Nexora PDF Summarizer. Provide a crisp, structured executive summary of the provided text, complete with key highlights (bullet points), core vocabulary definitions, and a short 3-sentence takeaways section.`;
        userPrompt = `Document: ${fileName || "Lecture Notes"}\nContent Sample:\n${textContent || "The solar system consists of the Sun and the objects that orbit it, including eight planets, dwarf planets, moons, asteroids, and comets."}\n\nGenerate structured summaries:`;
        break;
      }
      case "quiz": {
        const { topic, difficulty, count = 5 } = payload;
        systemPrompt = `You are the Nexora Quiz Generator. Generate exactly ${count} multiple-choice questions on "${topic}" with difficulty level "${difficulty}".
You must return the response in strict JSON format. Do not include markdown formatting or backticks around the JSON. The JSON should be an array of objects, where each object has:
- question: string
- options: array of 4 strings
- answerIndex: number (0-3)
- explanation: string`;
        userPrompt = `Generate a JSON quiz with ${count} questions about: "${topic}"`;
        break;
      }
      case "study-plan": {
        const { subject, timeline, dailyHours, targetGoal } = payload;
        systemPrompt = `You are the Nexora Study Planner. Create a highly professional, structured, day-by-day study roadmap for "${subject}" over a timeline of "${timeline}". The student can dedicate "${dailyHours}" hours daily, with the goal of "${targetGoal}". Include milestones, specific daily topics, revision cycles, and streak preservation tips.`;
        userPrompt = `Create a customized daily study schedule based on: Goal: ${targetGoal}, Timeline: ${timeline}, Time: ${dailyHours} hrs/day.`;
        break;
      }
      case "career-guide": {
        const { interests, strengths, targetIndustry } = payload;
        systemPrompt = `You are the Nexora Career Mentor. Provide an extensive career advisory roadmap for a student interested in "${interests}", possessing strengths in "${strengths}", and aiming for the "${targetIndustry}" industry. Detail core tech/skills to master, recommended course pathways, mock-project ideas, and 5-year outlook.`;
        userPrompt = `Career consultation details:\nInterests: ${interests}\nStrengths: ${strengths}\nTarget Industry: ${targetIndustry}`;
        break;
      }
      case "weakness-detection": {
        const { performanceData } = payload;
        systemPrompt = `You are the Nexora Student Performance Evaluator. Based on the provided quiz accuracy metrics and study logs, identify the exact cognitive weak topics, list actionable revision tips, suggest flashcard topics, and generate a dynamic motivational challenge to get the student back on track.`;
        userPrompt = `Performance Data:\n${JSON.stringify(performanceData || {})}\nAnalyze and report weak areas, action plan, and revision cycles:`;
        break;
      }
      case "flashcards": {
        const { topic, count = 4 } = payload;
        systemPrompt = `You are the Nexora Flashcards Generator. Generate exactly ${count} highly effective learning flashcards on "${topic}".
You must return the response in strict JSON format. Do not include markdown formatting or backticks around the JSON. The JSON should be an array of objects, where each object has:
- question: string (the front of the card)
- answer: string (the back of the card)`;
        userPrompt = `Generate a JSON flashcard deck with ${count} cards about: "${topic}"`;
        break;
      }
      case "revision": {
        const { topic } = payload;
        systemPrompt = `You are the Nexora AI Revision Engine. For the topic "${topic}", generate a high-intensity study and revision guide. Include a 5-minute summary, core formulas or definitions, a cheat-sheet bullet-list, and a recommended spaced repetition timeline (1 day, 3 days, 7 days, 30 days) with specific actions.`;
        userPrompt = `Build an intensive revision guide for: "${topic}"`;
        break;
      }
      case "memory": {
        const { topic } = payload;
        systemPrompt = `You are the Nexora Cognitive Memory Coach. For "${topic}", generate memorable and highly effective retention aids:
1. Custom Mnemonics or acronyms to easily recall lists or formulas.
2. An 'Active Recall Quiz' consisting of 3 deep, conceptual questions designed to trigger retrieval.
3. A 'Mind-Palace' or spatial memory hook description to store these facts.`;
        userPrompt = `Generate cognitive memory hooks for: "${topic}"`;
        break;
      }
      case "arena-generate": {
        const { subject } = payload;
        systemPrompt = `You are the Nexora Sunday Competition Creator. Generate exactly 3 highly challenging, conceptual multiple choice questions on "${subject || "Advanced Science"}".
You must return the response in strict JSON format. Do not include markdown formatting or backticks around the JSON. The JSON should be an array of objects, where each object has:
- q: string (the question)
- options: array of 4 strings (the options)
- ans: number (0-3, the index of the correct option)`;
        userPrompt = `Generate exactly 3 challenging competition questions on: "${subject || "Advanced Science"}"`;
        break;
      }
      case "coding-review": {
        const { topic, code } = payload;
        systemPrompt = `You are the Nexora AI Coding Mentor. Analyze the provided code for the topic "${topic}". Give a detailed line-by-line review of the code's efficiency, syntax correctness, space/time complexity, potential optimizations, and any bugs. Finish with an optimized/perfect version of the code in markdown.`;
        userPrompt = `Review this code for topic "${topic}":\n\n\`\`\`\n${code}\n\`\`\``;
        break;
      }
      case "interview-evaluation": {
        const { role, question, answer } = payload;
        systemPrompt = `You are the Nexora AI Interview Examiner. Evaluate the student's typed answer for the technical question "${question}" under the role "${role}". Score the response from 1 to 10 on precision, depth, and communication. Provide detailed rubric-based feedback and a model response that represents a perfect answer.`;
        userPrompt = `Role: ${role}\nQuestion: ${question}\nStudent Answer: "${answer}"`;
        break;
      }
      case "resume-build": {
        const { name, goal, education, skills } = payload;
        systemPrompt = `You are the Nexora AI Resume Builder. Generate a high-end, professionally styled, ATS-optimized, copyable LaTeX-style Markdown resume. Customize descriptions, expand action bullets, align career metrics, and add an AI summary based on the provided credentials.`;
        userPrompt = `Generate resume for:\nName: ${name}\nCareer Goal: ${goal}\nEducation: ${education}\nSkills: ${skills}`;
        break;
      }
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const interaction = await ai.interactions.create({
      model: "gemini-3.5-flash",
      input: userPrompt,
      system_instruction: systemPrompt,
      generation_config: {
        temperature: 0.7,
      },
      ...(action === "quiz" || action === "flashcards" || action === "arena-generate" ? {
        response_format: {
          type: Type.ARRAY,
        }
      } : {}),
    });

    let text = interaction.output_text || "";
    if (!text) {
      for (const step of interaction.steps) {
        if (step.type === 'model_output') {
          const textContent = step.content?.find(c => c.type === 'text');
          if (textContent && textContent.text) {
            text += textContent.text;
          }
        }
      }
    }
    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: error?.message || "An unexpected error occurred during AI processing." },
      { status: 500 }
    );
  }
}
