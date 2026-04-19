# LangChain Expression Language（LCEL）知识点总结

## 1. LCEL 是什么？
LCEL（LangChain Expression Language）是 LangChain 1.x 推出的声明式、可组合的 AI 流程表达方式。它让你像搭积木一样灵活组合链、工具、分支、并行等，实现复杂的 AI 应用。

## 2. LCEL 的核心组件
- **RunnableSequence**：顺序链，数据依次流经每个步骤。
- **RunnableMap**：并行链，同一输入分发到多个子链，聚合输出。
- **pipe**：将一个步骤的输出作为下一个步骤的输入（常用于 PromptTemplate/LLM 组合）。
- **分支/条件/自定义函数**：可插入任意 JS/TS 逻辑。

## 3. 典型用法

### 顺序链
```ts
const chain = RunnableSequence.from([
  step1,
  step2,
  step3,
]);
```

### 并行链
```ts
const parallel = RunnableMap.from({
  a: chainA,
  b: chainB,
});
```

### pipe 组合
```ts
const chainA = promptA.pipe(llm);
```

### 复杂链式组合
```ts
const lcelChain = RunnableSequence.from([
  async (input) => ({ text: input.text }),
  parallelChain, // 并行处理
  async (result) => `总结：${result.summary.content}\n翻译：${result.translation.content}`,
]);
```

## 4. 适用场景
- 多步推理、数据流转
- 多模型/多工具协作
- 并行处理、聚合结果
- 条件分支、动态路由
- 流式输出、异步处理

## 5. 优势
- 组合灵活，易于维护和扩展
- 支持异步、流式、分支、聚合等复杂场景
- 让 AI 应用开发声明式、可读性强

---

**结论：**
LCEL 是 LangChain 1.x 推荐的主流开发范式，适合构建复杂、可维护的 AI 应用流程。