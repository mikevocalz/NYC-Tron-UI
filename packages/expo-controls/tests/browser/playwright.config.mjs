import {defineConfig} from "playwright/test";
export default defineConfig({
  testDir:".",testMatch:"menu.spec.mjs",fullyParallel:false,retries:0,
  reporter:"list",use:{baseURL:"http://127.0.0.1:4178",trace:"retain-on-failure"},
  webServer:{command:"node server.mjs",url:"http://127.0.0.1:4178",reuseExistingServer:false},
  projects:[{name:"chromium",use:{browserName:"chromium"}}]
});
