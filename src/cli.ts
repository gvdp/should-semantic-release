import { parseArgs } from "@pkgjs/parseargs";

import { shouldSemanticRelease } from "./shouldSemanticRelease.js";

export async function shouldSemanticReleaseCLI(args: string[]) {
	const { values } = parseArgs({
		args,
		options: {
			releaseCommitTester: { type: "string" },
			verbose: { short: "v", type: "boolean" },
		},
		strict: false,
		tokens: true,
	});

	// console.log("values", values);
	let cleanReleaseCommitTester;
	if (values.releaseCommitTester) {
		cleanReleaseCommitTester = (values.releaseCommitTester as string)
			.replace(/^"(.*)"$/, "$1")
			.replace(/^'(.*)'$/, "$1");
	}

	return await shouldSemanticRelease({
		...(cleanReleaseCommitTester && {
			releaseCommitTester: new RegExp(cleanReleaseCommitTester),
		}),
		verbose: !!values.verbose,
	});
}
