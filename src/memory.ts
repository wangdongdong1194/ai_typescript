import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { llm } from "./llm";

// 简单内存实现
const memory: string[] = [];

// 定义 prompt
const prompt = PromptTemplate.fromTemplate(
  "历史对话：{history}\n用户：{input}\nAI："
);

// 定义模型
const model = llm;

// 组合链（只负责生成回复，不负责存储记忆）
const chain = RunnableSequence.from([
  async (input: any) => {
    const history = memory.join("\n");
    // console.log("[PROMPT HISTORY]", history);
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
  console.log("[MEMORY]", memory);
//   console.log("第一轮AI回复：", res1);

  lastInput = { input: "你是谁？" };
  let res2 = await chain.invoke(lastInput);
  memory.push(`用户：${lastInput.input}\nAI：${res2.content}`);
  console.log("[MEMORY]", memory);
//   console.log("第二轮AI回复：", res2);
}

main();
