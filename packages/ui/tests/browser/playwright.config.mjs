import {defineConfig} from "playwright/test";
// PORT lets a second checkout run its lane beside another one.
const port=Number(process.env.PORT??4179);
export default defineConfig({
  testDir:".",testMatch:"*.spec.mjs",fullyParallel:false,retries:0,
  reporter:"list",use:{baseURL:`http://127.0.0.1:${port}`,trace:"retain-on-failure"},
  webServer:{command:"node server.mjs",url:`http://127.0.0.1:${port}`,reuseExistingServer:false},
  projects:[{name:"chromium",use:{browserName:"chromium"}}]
});
