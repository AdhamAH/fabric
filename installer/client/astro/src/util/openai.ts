
import * as path from "node:path";
import * as fs from "node:fs";
import OpenAI from "openai";
import * as os from "node:os";

export function loadApiKey() {
  // To use with local environment
  // const configPath = path.join(path.dirname(''), ".env");
  // To use with fabric
  const configPath = path.join(os.homedir(), ".config", "fabric", ".env");
  if (fs.existsSync(configPath)) {
    const envContents = fs.readFileSync(configPath, { encoding: "utf8" });
    const matches = envContents.match(/^OPENAI_API_KEY=(.*)$/m);
    if (matches && matches[1]) {
      return matches[1];
    }
  }
  return null;
}
export const openai = new OpenAI({
  apiKey:loadApiKey()!
});

export async function getModelsList(){
  const list = await openai.models.list();
  const sortedList = list.data.sort()
  let models:string[] =[]
  for await (const model of sortedList) {
   models.push(model.id)
  }
  models.sort()
  return models
}