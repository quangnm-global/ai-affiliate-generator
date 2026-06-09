import { openAIConfig } from "@/lib/openai/config";

/** @deprecated Use `chatCompletion` / `chatCompletionJson` from `@/lib/openai` */
export function getOpenAIModel() {
  return openAIConfig.defaultModel;
}
