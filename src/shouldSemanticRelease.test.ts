import { describe, expect, it, vi } from "vitest";

import { shouldSemanticRelease } from "./shouldSemanticRelease.js";

const mockExecOrThrow = vi.fn();

vi.mock("./utils.js", () => ({
	get execOrThrow() {
		return mockExecOrThrow;
	},
}));

describe("shouldSemanticRelease", () => {
	it("returns false when a release commit is found first", async () => {
		mockExecOrThrow.mockResolvedValue(`release v1.2.3`);

		const actual = await shouldSemanticRelease();

		expect(actual).toBe(false);
	});

	it("returns true when a meaningful commit is found first", async () => {
		mockExecOrThrow.mockResolvedValue(`feat: abc def`);

		const actual = await shouldSemanticRelease();

		expect(actual).toBe(true);
	});

	it("returns true when a meaningful commit is found after a dependency update commit", async () => {
		mockExecOrThrow.mockResolvedValue(
			`chore(deps): update dependency eslint-plugin-n to v17.17.0\nfeat: abc def`,
		);

		const actual = await shouldSemanticRelease({
			releaseCommitTester: /^chore: release v?\d+\.\d+\.\d+$/,
		});

		expect(actual).toBe(true);
	});

	it("returns false when no commits are meaningful", async () => {
		mockExecOrThrow.mockResolvedValue(`chore: abc`);

		const actual = await shouldSemanticRelease();

		expect(actual).toBe(false);
	});
});
