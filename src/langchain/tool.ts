import { DynamicTool, Tool } from "@langchain/core/tools";
import fs from "fs";
/**
 * 通过DynamicTool和Tool创建工具示例
 * 
 * Tool已经不推荐使用，会报错
 */

export const upperTool = new DynamicTool({
    name: "uppercase",
    description: "将输入字符串转为大写",
    func: async (input: string) => String(input).toUpperCase(),
});

export const timeTool = new DynamicTool({
    name: "get_time",
    description: "返回当前时间字符串",
    func: async () => {
        return new Date().toLocaleString();
    },
});

export const writeLogTool = new DynamicTool({
    name: "write_log",
    description: "将输入输出写入到日志",
    func: async (input: string) => {
        fs.appendFileSync(
            "log2.txt",
            `${new Date().toISOString()} --> ${input}\n${"-".repeat(50)}\n\n`,
        );
        return `写入成功: ${input}`;
    },
});

async function main() {
    const upperRes = await upperTool.invoke("hello, langchain tool!");
    console.log("==>", upperRes);
    const timeRes = await timeTool.invoke("");
    console.log("==>", timeRes);
}

// main();