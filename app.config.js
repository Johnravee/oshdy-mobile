// app.config.js - expose runtime config via `extra` from environment variables
// For local development you can create a .env file and use dotenv when running locally.
// In production use EAS secrets: `eas secret:create --name SUPABASE_URL --value <...>`

try {
  // Only require dotenv in local dev where .env may exist. Wrapping in try/catch avoids throwing when not available.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const dotenv = require('dotenv')
  dotenv.config()
} catch (err) {
  // ignore if dotenv isn't installed or .env is not present
}

export default ({ config }) => {
  return {
	...config,
	extra: {
	  SUPABASE_URL: process.env.SUPABASE_URL || process.env.SUPABASEURL,
	  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || process.env.SUPABASEANONKEY,
	},
  }
}
