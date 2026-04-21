import { createAgent } from "langchain";
import { timeTool, upperTool, writeLogTool } from "./tool";
import { llm } from "./llm";

async function main() {
    const tools = [writeLogTool, upperTool, timeTool];
    const agent = createAgent({
        model: llm,
        tools: tools,
    });
    const res = await agent.invoke({
        messages: [{
            role: 'system',
            content: '你是一个资深的langchain智能体，可以调用工具来完成任务。'
        }, {
            role: 'user',
            content: '分析如何学习langchain，并把当前时间转换为大写，分析结果写入日志。'
        }]
    });
    console.log("agent result ==>", res);
}
main();