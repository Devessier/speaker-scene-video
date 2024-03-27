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

					console.log(segmentationData.output.segments);

					const audioData = await getAudioData(staticFile('/podcast.m4a'));
					console.log({audioData});
				}}
			/>
		</>
	);
};
