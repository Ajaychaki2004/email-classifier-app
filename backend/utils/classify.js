import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";

export async function classifyEmails(emails, openaiKey) {
  if (!openaiKey) throw new Error("OpenAI key missing");
  
  const model = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    configuration: { apiKey: openaiKey },
    temperature: 0.2,
  });

  const classified = [];

  for (const email of emails) {
    const content = `
      Subject: ${email.subject}
      From: ${email.from}
      Body: ${email.snippet}
          
      Classify this email into one of these categories:
      - Important
      - Promotions
      - Social
      - Marketing
      - Spam
      - General

      Return only the category name.`;

    const response = await model.invoke([new HumanMessage(content)]);
    classified.push({
      ...email,
      category: response.content.trim(),
    });
  }

  return classified;
}
