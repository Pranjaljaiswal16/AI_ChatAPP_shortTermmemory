const test = require("node:test");
const assert = require("node:assert/strict");

const { normalizeUserForResponse } = require("../controllers/auth.controller");
const { getGeminiMimeType } = require("../service/ai.service");

test("normalizeUserForResponse removes password hashes from auth responses", () => {
  const user = {
    _id: "user-123",
    username: "demo-user",
    password: "hashed-super-secret",
  };

  assert.deepEqual(normalizeUserForResponse(user), {
    username: "demo-user",
    id: "user-123",
  });
});

test("getGeminiMimeType preserves the uploaded file mime type", () => {
  assert.equal(getGeminiMimeType({ mimetype: "image/png" }), "image/png");
  assert.equal(getGeminiMimeType({ mimetype: "image/webp" }), "image/webp");
});
