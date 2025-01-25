export interface Model {
  id: string
  name: string
  description: string
  pro: boolean
  maxInput: number
}

export const models: Model[] = [
  // {
  //   id: "gpt-4",
  //   name: "GPT 4",
  //   description:
  //     "Created by OpenAI.",
  // },
  // {
  //   id: "amazon.titan-text-lite-v1",
  //   name: "Titan - Lite",
  //   description: "Lite is a light weight efficient model, ideal for fine-tuning of English-language tasks, including like summarizations and copy writing, where customers want a smaller, more cost-effective model that is also highly customizable.",
  //   pro: false,
  //   maxInput: 4096
  // },
  {
    id: "gpt-4-turbo-preview",
    name: "GPT-4",
    description: "Latest GPT-4 turbo version.",
    pro: true,
    maxInput: 128000
  },
  {
    id: "anthropic.claude-3-sonnet-20240229-v1:0",
    name: "Claude 3 Sonnet",
    description: "The ideal balance between intelligence and speed—particularly for enterprise workloads. It excels at complex reasoning, nuanced content creation, scientific queries, math, and coding. Data teams can use Sonnet for RAG, as well as search and retrieval across vast amounts of information while sales teams can leverage Sonnet for product recommendations, forecasting, and targeted marketing.",
    pro: true,
    maxInput: 200000
  },
  // {
  //   id: "ai21.j2-ultra-v1",
  //   name: "Jurassic-2 Ultra",
  //   description: "Created by AI 21 Labs.",
  // },
  {
    id: "amazon.titan-text-express-v1",
    name: "Titan - Express",
    description: "Created by Amazon.",
    pro: false,
    maxInput: 8000
  },
  // {
  //   id: "meta.llama2-70b-chat-v1",
  //   name: "Llama 2 Chat 70B",
  //   description: "Created by Meta."
  // },
  // {
  //   id: "cohere.command-text-v14",
  //   name: "Command",
  //   description: "Created by Cohere."
  // }
]