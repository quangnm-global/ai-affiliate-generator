export type ContentType =
  | "product_review"
  | "comparison"
  | "buying_guide"
  | "social_post";

export type GenerationStatus = "pending" | "completed" | "failed";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  credits: number;
  created_at: string;
  updated_at: string;
}

export interface Generation {
  id: string;
  user_id: string;
  title: string;
  content_type: ContentType;
  product_name: string;
  affiliate_url: string | null;
  keywords: string[] | null;
  tone: string | null;
  prompt: string;
  output: string | null;
  tokens_used: number | null;
  credits_cost: number;
  status: GenerationStatus;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  balance_after: number;
  reason: string;
  reference_id: string | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          credits?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          credits?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      generations: {
        Row: Generation;
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content_type: ContentType;
          product_name: string;
          affiliate_url?: string | null;
          keywords?: string[] | null;
          tone?: string | null;
          prompt: string;
          output?: string | null;
          tokens_used?: number | null;
          credits_cost?: number;
          status?: GenerationStatus;
          error_message?: string | null;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content_type?: ContentType;
          product_name?: string;
          affiliate_url?: string | null;
          keywords?: string[] | null;
          tone?: string | null;
          prompt?: string;
          output?: string | null;
          tokens_used?: number | null;
          credits_cost?: number;
          status?: GenerationStatus;
          error_message?: string | null;
          created_at?: string;
          completed_at?: string | null;
        };
        Relationships: [];
      };
      credit_transactions: {
        Row: CreditTransaction;
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          balance_after: number;
          reason: string;
          reference_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          balance_after?: number;
          reason?: string;
          reference_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_generation_with_credit: {
        Args: {
          p_user_id: string;
          p_title: string;
          p_content_type: ContentType;
          p_product_name: string;
          p_affiliate_url: string | null;
          p_keywords: string[] | null;
          p_tone: string;
          p_prompt: string;
        };
        Returns: string;
      };
      refund_generation_credit: {
        Args: {
          p_user_id: string;
          p_generation_id: string;
        };
        Returns: void;
      };
      get_credit_balance: {
        Args: {
          p_user_id: string;
        };
        Returns: number;
      };
    };
    Enums: {
      content_type: ContentType;
      generation_status: GenerationStatus;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
