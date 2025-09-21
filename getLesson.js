{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // getLesson.js\
import fetch from "node-fetch";\
\
export async function handler(event, context) \{\
  try \{\
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;\
\
    const prompt = `\
Generate a 5-step interactive life skills lesson on one topic for a beginner.\
Include:\
1. A short text for each step.\
2. Multiple choice quiz questions where needed with an answer.\
3. Input challenge for one step with numeric answer.\
Return as JSON array with keys: title, content, choices, correct, need, want, input, answer.\
`;\
\
    const response = await fetch("https://api.openai.com/v1/chat/completions", \{\
      method: "POST",\
      headers: \{\
        "Content-Type": "application/json",\
        "Authorization": `Bearer $\{OPENAI_API_KEY\}`\
      \},\
      body: JSON.stringify(\{\
        model: "gpt-4-mini",\
        messages: [\{ role: "user", content: prompt \}],\
        temperature: 0.7\
      \})\
    \});\
\
    const data = await response.json();\
    let text = data.choices[0].message.content;\
\
    // Remove any ```json formatting\
    text = text.replace(/```json|```/g, "").trim();\
    const aiSteps = JSON.parse(text);\
\
    return \{ statusCode: 200, body: JSON.stringify(aiSteps) \};\
\
  \} catch (err) \{\
    console.error(err);\
    return \{ statusCode: 500, body: JSON.stringify(\{ error: "Failed to fetch AI lesson" \}) \};\
  \}\
\}}