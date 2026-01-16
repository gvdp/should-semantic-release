import conventionalCommitsParser from "conventional-commits-parser";

const alwaysMeaningfulTypes = new Set(["feat", "fix", "perf"]);

const alwaysIgnoredTypes = new Set(["docs", "refactor", "style", "test"]);

const releaseCommitTester =
	/^(?:chore(?:\(.*\))?:?)?\s*release|v?\d+\.\d+\.\d+/;

export function getCommitMeaning(message: string): {
	meaning: "ignored" | "meaningful" | "release";
	type?: null | string;
} {
	// Some types are always meaningful or ignored, regardless of potentially release-like messages
	const { header, notes, type } = conventionalCommitsParser.sync(message, {
		breakingHeaderPattern: /^(\w*)(?:\((.*)\))?!: (.*)$/,
	});
	if (
		notes.some((note) => /^BREAKING[ -]CHANGE$/.exec(note.title)) ||
		header?.match(/^BREAKING[ -]CHANGE(?: \([^)]+\))?:/)
	) {
		return { meaning: "meaningful", type };
	}

	if (type) {
		if (alwaysMeaningfulTypes.has(type)) {
			return { meaning: "meaningful", type };
		}

		if (alwaysIgnoredTypes.has(type)) {
			return { meaning: "ignored", type };
		}
	}

	// If we've hit a release commit, we know we don't need to release
	if (releaseCommitTester.test(message)) {
		return { meaning: "release", type };
	}

	return { meaning: "ignored", type };
}
