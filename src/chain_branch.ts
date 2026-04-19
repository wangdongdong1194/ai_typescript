import { RunnableSequence } from "@langchain/core/runnables";

// 示例子链
const chainA = async (input: any) => {
    return `A链处理：${input.value}`;
};
const chainB = async (input: any) => {
    return `B链处理：${input.value}`;
};

// 分支链：根据 type 字段选择不同子链
const branchChain = RunnableSequence.from([
    async (input: any) => {
        if (input.type === "A") {
            return await chainA(input);
        } else if (input.type === "B") {
            return await chainB(input);
        } else {
            return `默认处理：${input.value}`;
        }
    },
    (result: string) => result + " ->->- ABC" // 简单后处理，保证有两个步骤
]);

async function main() {
    console.log(await branchChain.invoke({ type: "A", value: "测试1" }));
    console.log(await branchChain.invoke({ type: "B", value: "测试2" }));
    console.log(await branchChain.invoke({ type: "C", value: "测试3" }));
}

main();

// 说明：
// 1. 分支链可用 if/else/switch 实现多路分流。
// 2. LangChain 不建议链内直接做循环（如 while/for），如需循环应在主业务逻辑中实现，链本身适合做单步流转和分支。
