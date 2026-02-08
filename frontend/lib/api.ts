import axios from "axios";

type CareerPlanRequest = {
  user_profile: Record<string, unknown>;
  skills: string[];
  target_roles: string[];
};

type CareerPlanResponse = {
  skill_analysis: Record<string, unknown>;
  market_analysis: Record<string, unknown>;
  strategy_analysis: Record<string, unknown>;
  roadmap: Record<string, unknown>;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:8000";

export async function createCareerPlan(
  payload: CareerPlanRequest
): Promise<CareerPlanResponse> {
  try {
    const response = await axios.post<CareerPlanResponse>(
      `${API_BASE_URL}/career-plan`,
      payload
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.detail ||
        error.response?.statusText ||
        "Request failed";
      throw new Error(message);
    }
    throw new Error("Unexpected error");
  }
}
