export type Problem = {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
};

const PROBLEM_HEADERS = { "Content-Type": "application/problem+json" };

export function problem(p: Problem): Response {
  return new Response(JSON.stringify(p), { status: p.status, headers: PROBLEM_HEADERS });
}

export const Problems = {
  validation(detail: string): Response {
    return problem({
      type: "about:blank",
      title: "Validation failed",
      status: 400,
      detail,
    });
  },
  unauthorized(): Response {
    return problem({
      type: "about:blank",
      title: "Unauthorized",
      status: 401,
      detail: "Missing or invalid session cookie",
    });
  },
  notFound(detail = "Resource not found"): Response {
    return problem({
      type: "about:blank",
      title: "Not Found",
      status: 404,
      detail,
    });
  },
  rateLimited(detail = "Too many requests"): Response {
    return problem({
      type: "about:blank",
      title: "Too Many Requests",
      status: 429,
      detail,
    });
  },
  internal(detail = "Internal server error"): Response {
    return problem({
      type: "about:blank",
      title: "Internal Server Error",
      status: 500,
      detail,
    });
  },
};
