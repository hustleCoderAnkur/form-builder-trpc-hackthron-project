export function buildOpenApiSpec() {
  const base = process.env.API_BASE_URL ?? "https://form-builder-trpc-hackthron-project.vercel.app/";
  return {
    openapi: "3.1.0",
    info: {
      title: "formFactory API",
      version: "1.0.0",
      description:
        "Public REST API for published forms. Submit responses without authentication.",
    },
    servers: [{ url: base }],
    paths: {
      "/api/v1/forms": {
        get: {
          tags: ["Explore"],
          summary: "List public published forms",
          parameters: [
            { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
            { name: "offset", in: "query", schema: { type: "integer", default: 0 } },
          ],
          responses: { "200": { description: "OK" } },
        },
      },
      "/api/v1/forms/{slug}": {
        get: {
          tags: ["Forms"],
          summary: "Get published form with fields",
          parameters: [
            { name: "slug", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: { "200": { description: "OK" }, "404": { description: "Not found" } },
        },
      },
      "/api/v1/forms/{slug}/responses": {
        post: {
          tags: ["Responses"],
          summary: "Submit a response",
          parameters: [
            { name: "slug", in: "path", required: true, schema: { type: "string" } },
          ],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { type: "object" } } },
          },
          responses: {
            "201": { description: "Created" },
            "400": { description: "Validation error" },
            "429": { description: "Rate limited" },
          },
        },
      },
    },
  };
}
