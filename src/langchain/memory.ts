import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { llm } from "./llm";

// 记忆长度限制
const MAX_HISTORY = 5;
const memory: string[] = [];

// 定义 prompt，带AI身份设定
const prompt = PromptTemplate.fromTemplate(
    `你叫小智，是一名智能AI助手，善于总结和记忆对话历史。
历史对话：{history}
用户：{input}
AI：`
);

// 定义模型
const model = llm;

// 组合链（只负责生成回复，不负责存储记忆）
const chain = RunnableSequence.from([
    async (input: any) => {
        const history = memory.join("\n");
        return { history, input: input.input };
    },
    prompt,
    model,
]);

// 示例调用
async function main() {
    let lastInput = { input: "你好" };
    let res1 = await chain.invoke(lastInput);
    memory.push(`用户：${lastInput.input}\nAI：${res1.content}`);
    if (memory.length > MAX_HISTORY) memory.splice(0, memory.length - MAX_HISTORY);
    console.log("[MEMORY]", memory);

    lastInput = { input: "你是谁？" };
    let res2 = await chain.invoke(lastInput);
    memory.push(`用户：${lastInput.input}\nAI：${res2.content}`);
    if (memory.length > MAX_HISTORY) memory.splice(0, memory.length - MAX_HISTORY);
    console.log("[MEMORY]", memory);

    lastInput = { input: "你上次说了啥？" };
    let res3 = await chain.invoke(lastInput);
    memory.push(`用户：${lastInput.input}\nAI：${res3.content}`);
    if (memory.length > MAX_HISTORY) memory.splice(0, memory.length - MAX_HISTORY);
    console.log("[MEMORY]", memory);
}

main();