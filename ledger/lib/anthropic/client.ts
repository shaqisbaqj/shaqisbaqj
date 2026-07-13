import "server-only";
import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export const CHAT_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5";
