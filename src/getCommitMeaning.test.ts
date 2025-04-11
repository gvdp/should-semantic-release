import { describe, expect, it } from "vitest";

import { getCommitMeaning } from "./getCommitMeaning.js";

describe("getCommitMeaning", () => {
	it.each([
		["chore", { type: undefined }],
		["chore: deps", { type: "chore" }],
		["chore(deps): bump", { type: "chore" }],
		["chore(deps): update dependency eslint-plugin-n to v17.17.0 ", "release"],
		[
			"chore(deps-minor): update dependency prettier from 3.2.5 to 3.5.3",
			"release",
		],
		["docs", { type: undefined }],
		["docs: bump", { type: "docs" }],
		["docs: message", { type: "docs" }],
		["feat", { type: undefined }],
		["feat: bump", "meaningful"],
		["feat: bump version to 1.2.3", "meaningful"],
		["feat: message", "meaningful"],
		["fix", { type: undefined }],
		["fix: bump", "meaningful"],
		["fix: bump version to 1.2.3", "meaningful"],
		["fix: message", "meaningful"],
		["perf", { type: undefined }],
		["perf: bump", "meaningful"],
		["perf: bump version to 1.2.3", "meaningful"],
		["perf: message", "meaningful"],
		["style", { type: undefined }],
		["style: bump", { type: "style" }],
		["style: bump version to 1.2.3", { type: "style" }],
		["style: message", { type: "style" }],
		["0.0.0", "release"],
		["v0.0.0", "release"],
		["1.2.3", "release"],
		["v1.2.3", "release"],
		["1.23.456", "release"],
		["v1.23.456", "release"],
		["12.345.6789", "release"],
		["v12.345.6789", "release"],
		["chore: release", "release"],
		["chore: release 1.2.3", "release"],
		["chore: release v1.2.3", "release"],
		["chore(deps): release", "release"],
		["chore(deps): release 1.2.3", "release"],
		["chore(deps): release v1.2.3", "release"],
		["chore!: message", "meaningful"],
		["docs!: message", "meaningful"],
		["chore!: release", "meaningful"],
		["feat!: a feature with a breaking change", "meaningful"],
		["chore: bump\n\nBREAKING CHANGE: breaks things", "meaningful"],
		["chore: bump\n\nBREAKING-CHANGE: breaks things", "meaningful"],
		["docs: bump\n\nBREAKING CHANGE: breaks things", "meaningful"],
		["docs: bump\n\nBREAKING-CHANGE: breaks things", "meaningful"],
		[
			"chore: deps\n\nBREAKING-CHANGE: breaks things\nMultiple: footer notes",
			"meaningful",
		],
		["chore: deps\n\n! in the commit body", { type: "chore" }],
		[
			"chore: deps\n\nFooter-note: other than BREAKING CHANGE",
			{ type: "chore" },
		],
		[
			"chore: deps\n\nMultiple: footer notes\nMultiple: footer notes",
			{ type: "chore" },
		],
		// This test may should be { type: "chore" },
		// but conventionalCommitsParser looks like can't parse this case correctly
		[
			"chore: deps\n\nBREAKING CHANGE line starts with BREAKING CHANGE (no :)",
			"meaningful",
		],
		[
			"chore: deps\n\nline contains BREAKING CHANGE:  inside it",
			{ type: "chore" },
		],
		[
			"BREAKING CHANGE: line starts with something like BREAKING CHANGE",
			"meaningful",
		],
		[
			"BREAKING CHANGE (major): line starts with something like BREAKING CHANGE and has modifier",
			"meaningful",
		],
		[
			"BREAKING-CHANGE: line starts with something like BREAKING-CHANGE",
			"meaningful",
		],
		[
			"BREAKING-CHANGE (major): line starts with something like BREAKING-CHANGE and has modifier",
			"meaningful",
		],
	])("returns %j for %s", (input, expected) => {
		expect(getCommitMeaning(input)).toEqual(expected);
	});

	it.each([
		[
			"chore(deps): update dependency eslint-plugin-n to v17.17.0",
			{ type: "chore" },
			/^chore: release v?\d+\.\d+\.\d+$/,
		],
		[
			"chore(deps-minor): update dependency prettier from 3.2.5 to 3.5.3",
			{ type: "chore" },
			/^chore: release v?\d+\.\d+\.\d+$/,
		],
	])(
		"commit %j returns %s with extra release commit tester %s ",
		(input, expected, releaseCommitTester) => {
			expect(getCommitMeaning(input, releaseCommitTester)).toEqual(expected);
		},
	);
});
