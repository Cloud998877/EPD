
import { GoogleGenAI } from "@google/genai";

// Initialization moved inside the function to ensure up-to-date API key usage and adherence to guidelines
export async function askGeminiAboutDoc(question: string): Promise<string> {
  // Always initialize a new instance before use to ensure the most current environment variables are used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `당신은 '퇴장방지의약품 원가보전 신청' 전문 컨설턴트이자 제약 회계 전문가입니다. 
      사용자가 질문한 "${question}"에 대해 다음 지침을 지켜 답변하세요:
      1. 제약회사의 실무자가 이해하기 쉽도록 전문적이면서도 친절하게 설명하세요.
      2. 해당 서류가 원가 산정 및 약가 보전 심사에 왜 결정적인지 강조하세요.
      3. 관련 법규나 심사평가원의 지침이 있다면 언급하여 신뢰도를 높이세요.
      4. 한국어로 정중하게 답변하세요.`,
      config: {
        temperature: 0.6,
        topP: 0.9,
      },
    });
    // Correctly accessing the text property directly on GenerateContentResponse
    return response.text || "죄송합니다. 적절한 답변을 생성하지 못했습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "현재 AI 상담이 원활하지 않습니다. 잠시 후 다시 이용해주세요.";
  }
}
