import { beforeEach, describe, expect, it } from "vitest";
import { hasCompletedVoiceSetup, markVoiceSetupComplete } from "./voice-setup";

describe("voice setup progress", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("remembers when voice setup is completed on this device", () => {
    expect(hasCompletedVoiceSetup()).toBe(false);

    markVoiceSetupComplete();

    expect(window.localStorage.getItem("voice-setup-complete")).toBe("true");
    expect(hasCompletedVoiceSetup()).toBe(true);
  });
});