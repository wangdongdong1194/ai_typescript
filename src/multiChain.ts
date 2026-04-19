import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { RunnableBranch } from "@langchain/core/runnables"; // 这两个类在 langchain 6.0.2 中已经被废弃，使用时会有警告提示，但仍然可以正常使用
import { llm } from "./llm";

// 定义两个 PromptTemplate
const prompt1 = PromptTemplate.fromTemplate("你是谁？");
const prompt2 = PromptTemplate.fromTemplate("请用一句话总结：{person}");

const chain1 = prompt1.pipe(llm);
const chain2 = prompt2.pipe(llm);

// 组合成序列链
const chain = RunnableSequence.from([
  chain1,
  (output: any) => ({ person: output }),
  chain2,
]);

// RouterChain: 根据输入动态选择不同的链
const routerChain = RunnableBranch.from([
  [
    (input: any) => typeof input === "object" && input.type === "summary",
    chain2,
  ],
  chain1, // 默认分支直接写链
]);

// 自定义链：可以是任意函数组合
const customChains = RunnableSequence.from([
  async (input: any) => {
    // 先用 chain1 获取身份
    const person = await chain1.invoke(input);
    // 自定义处理，比如拼接字符串
    return { person: person + "，很高兴认识你！" };
  },
  chain2,
]);

async function main() {
//   console.log("=== 顺序链 ===");
//   const result = await chain.invoke({});
//   console.log(result);

  console.log("=== RouterChain ===");
  const routerResult1 = await routerChain.invoke({ type: "summary", person: "张三" });
  console.log("router summary:", routerResult1.content, routerResult1.additional_kwargs); // 这里的 content 是 chain2 的输出，additional_kwargs 包含了 chain1 的输出
  // 默认分支 chain1 不需要 person 字段
  const routerResult2 = await routerChain.invoke({});
  console.log("router default:", routerResult2);

  console.log("=== CustomChains ===");
  const customResult = await customChains.invoke({});
  console.log(customResult);
}

main();