import { describe, expect, it } from "vitest";

import { getCommitMeaning } from "./getCommitMeaning.js";

describe("getCommitMeaning", () => {
	it.each([
		["chore", { meaning: "ignored", type: null }],
		["chore: deps", { meaning: "ignored", type: "chore" }],
		["chore(deps): bump", { meaning: "ignored", type: "chore" }],
		["docs", { meaning: "ignored", type: null }],
		["docs: bump", { meaning: "ignored", type: "docs" }],
		["docs: message", { meaning: "ignored", type: "docs" }],
		["feat", { meaning: "ignored", type: null }],
		["feat: bump", { meaning: "meaningful", type: "feat" }],
		["feat: bump version to 1.2.3", { meaning: "meaningful", type: "feat" }],
		["feat: message", { meaning: "meaningful", type: "feat" }],
		["fix", { meaning: "ignored", type: null }],
		["fix: bump", { meaning: "meaningful", type: "fix" }],
		["fix: bump version to 1.2.3", { meaning: "meaningful", type: "fix" }],
		["fix: message", { meaning: "meaningful", type: "fix" }],
		["perf", { meaning: "ignored", type: null }],
		["perf: bump", { meaning: "meaningful", type: "perf" }],
		["perf: bump version to 1.2.3", { meaning: "meaningful", type: "perf" }],
		["perf: message", { meaning: "meaningful", type: "perf" }],
		["style", { meaning: "ignored", type: null }],
		["style: bump", { meaning: "ignored", type: "style" }],
		["style: bump version to 1.2.3", { meaning: "ignored", type: "style" }],
		["style: message", { meaning: "ignored", type: "style" }],
		["0.0.0", { meaning: "release", type: null }],
		["v0.0.0", { meaning: "release", type: null }],
		["1.2.3", { meaning: "release", type: null }],
		["v1.2.3", { meaning: "release", type: null }],
		["1.23.456", { meaning: "release", type: null }],
		["v1.23.456", { meaning: "release", type: null }],
		["12.345.6789", { meaning: "release", type: null }],
		["v12.345.6789", { meaning: "release", type: null }],
		["chore: release", { meaning: "release", type: "chore" }],
		["chore: release 1.2.3", { meaning: "release", type: "chore" }],
		["chore: release v1.2.3", { meaning: "release", type: "chore" }],
		["chore(deps): release", { meaning: "release", type: "chore" }],
		["chore(deps): release 1.2.3", { meaning: "release", type: "chore" }],
		["chore(deps): release v1.2.3", { meaning: "release", type: "chore" }],
		["chore!: message", { meaning: "meaningful", type: null }],
		["docs!: message", { meaning: "meaningful", type: null }],
		["chore!: release", { meaning: "meaningful", type: null }],
		[
			"feat!: a feature with a breaking change",
			{ meaning: "meaningful", type: null },
		],
		[
			"chore: bump\n\nBREAKING CHANGE: breaks things",
			{ meaning: "meaningful", type: "chore" },
		],
		[
			"chore: bump\n\nBREAKING-CHANGE: breaks things",
			{ meaning: "meaningful", type: "chore" },
		],
		[
			"docs: bump\n\nBREAKING CHANGE: breaks things",
			{ meaning: "meaningful", type: "docs" },
		],
		[
			"docs: bump\n\nBREAKING-CHANGE: breaks things",
			{ meaning: "meaningful", type: "docs" },
		],
		[
			"chore: deps\n\nBREAKING-CHANGE: breaks things\nMultiple: footer notes",
			{ meaning: "meaningful", type: "chore" },
		],
		[
			"chore: deps\n\n! in the commit body",
			{ meaning: "ignored", type: "chore" },
		],
		[
			"chore: deps\n\nFooter-note: other than BREAKING CHANGE",
			{ meaning: "ignored", type: "chore" },
		],
		[
			"chore: deps\n\nMultiple: footer notes\nMultiple: footer notes",
			{ meaning: "ignored", type: "chore" },
		],
		// This test may should be { type: "chore" },
		// but conventionalCommitsParser looks like can't parse this case correctly
		[
			"chore: deps\n\nBREAKING CHANGE line starts with BREAKING CHANGE (no :)",
			{ meaning: "meaningful", type: "chore" },
		],
		[
			"chore: deps\n\nline contains BREAKING CHANGE:  inside it",
			{ meaning: "ignored", type: "chore" },
		],
		[
			"BREAKING CHANGE: line starts with something like BREAKING CHANGE",
			{ meaning: "meaningful", type: null },
		],
		[
			"BREAKING CHANGE (major): line starts with something like BREAKING CHANGE and has modifier",
			{ meaning: "meaningful", type: null },
		],
		[
			"BREAKING-CHANGE: line starts with something like BREAKING-CHANGE",
			{ meaning: "meaningful", type: null },
		],
		[
			"BREAKING-CHANGE (major): line starts with something like BREAKING-CHANGE and has modifier",
			{ meaning: "meaningful", type: null },
		],
	])("returns %j for %s", (input, expected) => {
		expect(getCommitMeaning(input)).toEqual(expected);
	});
});
