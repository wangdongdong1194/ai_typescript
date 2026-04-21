import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { llm } from "./llm";

// 简单演示 memory
const memory: string[] = [];
const prompt = PromptTemplate.fromTemplate(
    `你叫小智，是一名智能AI助手，善于总结和记忆对话历史。\n历史对话：{history}\n用户：{input}\nAI：`
);
const model = llm;

const chain = RunnableSequence.from([
    async (input: any) => {
        const history = memory.join("\n");
        return { history, input: input.input };
    },
    prompt,
    model,
]);

async function demoInvoke() {
    const res = await chain.invoke({ input: "你好" });
    console.log("invoke结果：", res.content);
}

async function demoStream() {
    const stream = await chain.stream({ input: "请用分步推理回答：1+2等于几？" });
    console.log("stream结果：");
    for await (const chunk of stream) {
        // chunk 可能是字符串、对象等，视模型实现而定
        const content = chunk.additional_kwargs?.reasoning_content;
        if (content) {
            console.log("分步推理内容：", content);
        }
    }
    console.log("\nstream结束");
}

(async () => {
    // await demoInvoke();
    await demoStream();
})();
