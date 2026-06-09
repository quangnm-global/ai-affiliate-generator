export interface TikTokContentOutput {
  hooks: string[];
  script: string;
  caption: string;
  hashtags: string[];
}

export interface TikTokContentInput {
  productName: string;
  productDescription: string;
}

export interface TikTokPipelineResult {
  data: TikTokContentOutput;
  tokensUsed: number;
  model: string;
}

export interface TikTokPipelineError {
  error: string;
  code: "VALIDATION_ERROR" | "OPENAI_ERROR" | "PARSE_ERROR" | "UNAUTHORIZED";
}
