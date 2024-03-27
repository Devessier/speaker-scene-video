import {Composition, staticFile} from 'remotion';
import {getAudioData} from '@remotion/media-utils';
import {z} from 'zod';
import {MyComposition, myCompSchema} from './Composition';
import './style.css';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="MyComp"
				component={MyComposition}
				durationInFrames={240}
				fps={30}
				width={1280}
				height={720}
				schema={myCompSchema}
				defaultProps={{
					frames: [],
				}}
				calculateMetadata={async () => {
					const fps = 30;

					const res = await fetch(staticFile('/segmentation.json'));
					const segmentationData = z
						.object({
							output: z.object({
								segments: z.array(
									z.object({
										start: z.string(),
										stop: z.string(),
										speaker: z.string(),
									})
								),
							}),
						})
						.parse(await res.json());

					const audioData = await getAudioData(staticFile('/podcast.m4a'));
					const durationInFrames = secondsToFrames(
						audioData.durationInSeconds,
						fps
					);

					return {
						durationInFrames,
					};
				}}
			/>
		</>
	);
};

/**
 * Parse timecodes in the format "hours:minutes:seconds.milliseconds" to a number of frames.
 */
function timeToFrame(time: string, fps: number): number {
	const [hours, minutes, secondsGroups] = time.split(':');
	const [seconds, milliseconds] = secondsGroups.split('.');

	return (
		(Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds)) * fps +
		secondsToFrames(Number(`0.${milliseconds}`), fps)
	);
}

function secondsToFrames(float: number, fps: number) {
	return Math.floor(float * fps);
}
