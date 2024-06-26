/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://ai-interview-mocker_owner:jK0dYViS8acD@ep-holy-field-a1166o5h.ap-southeast-1.aws.neon.tech/ai-interview-mocker?sslmode=require',
    }
  };
  