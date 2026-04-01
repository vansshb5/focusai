import axios from "axios";

export const parseTaskWithGrok = async (text) => {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are a task parsing assistant. Extract task details from user input and return ONLY a valid JSON object with these exact fields:
{
  "title": "clean task title",
  "deadline": "ISO date string or null",
  "priority": "low | medium | high",
  "estimatedTime": number in hours
}
No explanation. No markdown. No backticks. Just raw JSON.`
          },
          { role: "user", content: text }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const raw = response.data.choices[0].message.content.trim();
    return JSON.parse(raw);

  } catch (err) {
    if (err.response) {
      console.error("Groq parse error:", JSON.stringify(err.response.data, null, 2));
    }
    throw err;
  }
};

export const decomposeGoalWithGroq = async (goal) => {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are a productivity assistant. Break the user's goal into 5 actionable subtasks.
Each subtask must be specific and completable in one sitting.
Return ONLY a valid JSON array like this:
[
  { "title": "subtask title", "estimatedTime": 1.5, "priority": "high" },
  { "title": "subtask title", "estimatedTime": 1,   "priority": "medium" }
]
No explanation. No markdown. Just raw JSON array.`
          },
          { role: "user", content: `Goal: ${goal}` }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const raw = response.data.choices[0].message.content.trim();
    return JSON.parse(raw);

  } catch (err) {
    if (err.response) {
      console.error("Groq decompose error:", JSON.stringify(err.response.data, null, 2));
    }
    throw err;
  }
};