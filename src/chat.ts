import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";

const model = process.env.OPENAI_MODEL!;
const apiKey = process.env.OPENAI_API_KEY!;
const baseURL = process.env.OPENAI_BASE_URL!;

export const chat = new ChatOpenAI({
    openAIApiKey: apiKey,
    modelName: model,
    configuration: { baseURL },
});

async function main() {
    const res = await chat.invoke("如何使用typescript学习langchain？");
    console.log("==>", res);
}

main();