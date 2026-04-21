import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence, RunnableMap } from "@langchain/core/runnables";
import { llm } from "./llm";

// 多输入多输出链（Map）
const promptA = PromptTemplate.fromTemplate("请用一句话总结：{text}");
const promptB = PromptTemplate.fromTemplate("请翻译成英文：{text}");

const chainA = promptA.pipe(llm);
const chainB = promptB.pipe(llm);

// RunnableMap: 并行处理同一输入，输出多个结果
const parallelChain = RunnableMap.from({
    summary: chainA,
    translation: chainB,
});

// 复杂组合：先并行处理，再合并结果，最后再加工
const lcelChain = RunnableSequence.from([
    async (input: { text: string }) => ({ text: input.text }),
    parallelChain,
    async (result: { summary: { content: string }; translation: { content: string } }) => `总结：${result.summary.content}\n翻译：${result.translation.content}`,
]);

async function main() {
    const input = { text: "LangChain 是一个强大的 AI 编排框架。" };
    const result = await lcelChain.invoke(input);
    console.log("LCEL 复杂链式组合结果:\n", result);
}

main();

// 说明：
// 1. RunnableMap 可实现多路并行处理，适合多输入多输出场景。
// 2. RunnableSequence 可嵌套 Map、分支、流式等，灵活组合。
// 3. 你可以在链中任意步做异步处理、条件判断、结果聚合等复杂逻辑。