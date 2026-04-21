import "dotenv/config";
import { StateGraph, Annotation } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import readline from "readline";

const State = Annotation.Root({
    input: Annotation<string>(),
});

const askNode = (state: typeof State.State) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise<{ input: string }>((resolve) => {
        rl.question("请输入内容：", (answer) => {
            rl.close();
            resolve({
                input: answer?.trim() || ''
            });
        });
    });
};

const do1Node = async (state: typeof State.State) => {
    console.log("do1Node被调用了", state.input);
};
const do2Node = async (state: typeof State.State) => {
    console.log("do2Node被调用了", state.input);
};
const lastNode = async (state: typeof State.State) => {
    console.log("结束了", state.input);
};

const graphBuilder = new StateGraph(State);
const graph = graphBuilder
    .addNode("ask", askNode)
    .addNode("do1", do1Node)
    .addNode("do2", do2Node)
    .addNode('last', lastNode)
    .addEdge('__start__', 'ask')
    .addConditionalEdges('ask', (state) => { // 条件边，根据输入的内容决定走哪条边
        if (state.input === '1') {
            return ['do1'];
        } else if (state.input === '2') {
            return ['do2'];
        } else {
            return ['last'];
        }
    })
    .addEdge('do1', 'last')
    .addEdge('do2', 'last')
    .addEdge('last', '__end__')
    .compile();
(async () => {
    const result = await graph.invoke({});
    console.log("最终结果：", result);
})();