import { getCommitMeaning } from "./getCommitMeaning.js";
import { ShouldSemanticReleaseOptions } from "./types.js";
import { execOrThrow } from "./utils.js";

export async function shouldSemanticRelease({
	releaseCommitTester,
	verbose,
}: ShouldSemanticReleaseOptions = {}) {
	const rawHistory = await execOrThrow(`git log --pretty=format:"%s"`);
	const history = rawHistory.split("\n");

	const log = verbose
		? console.log.bind(console)
		: // eslint-disable-next-line @typescript-eslint/no-empty-function
			() => {};

	log(`Checking up to ${history.length} commits for release readiness...`);

	for (const message of history) {
		log(`Checking commit: ${message}`);
		const commitInfo = getCommitMeaning(message, releaseCommitTester);

		switch (commitInfo.meaning) {
			case "meaningful":
				log(
					`Found a meaningful commit of type ${commitInfo.type}. Returning true.`,
				);
				return true;

			case "release":
				log(
					`Found a release commit of type ${commitInfo.type}. Returning false.`,
				);
				return false;

			default:
				log(`Found type ${commitInfo.type}. Continuing.`);
		}
	}

	// If we've seen every commit in the history and none match, don't release
	log(
		"No commits found that indicate a semantic release is necessary. Returning false.",
	);
	return false;
}
