import {useVideoConfig} from 'remotion';
import {useCurrentFrame} from 'remotion';
import {AbsoluteFill, Audio, Img, Sequence, spring, staticFile} from 'remotion';
import {z} from 'zod';

export const myCompSchema = z.object({
	speakers: z.record(
		z.array(z.object({startFrame: z.number(), stopFrame: z.number()}))
	),
});

const EXIT_ANIMATION_DURATION_IN_FRAMES = 15;

export const MyComposition: React.FC<z.infer<typeof myCompSchema>> = ({
	speakers,
}) => {
	const speakersMetadata = [
		{
			name: 'Adam',
			color: '#0b0b0b',
			picture: staticFile('adam.jpg'),
			speakerLabel: 'A',
		},
		{
			name: 'Ian',
			color: '#342f2a',
			picture: staticFile('ian.jpg'),
			speakerLabel: 'B',
		},
		{
			name: 'Aaron',
			color: '#e2ad9d',
			picture: staticFile('aaron.jpg'),
			speakerLabel: 'C',
		},
	];

	return (
		<>
			<AbsoluteFill>
				<Img
					src={staticFile('/background.jpg')}
					className="h-full w-full object-cover object-center"
				/>
			</AbsoluteFill>

			<AbsoluteFill>
				<div className="bg-zinc-900 mx-12 my-10 h-full rounded-md shadow-2xl">
					<div className="grid grid-cols-3 grid-rows-1 p-4 gap-x-2 h-full">
						{speakersMetadata.map((speakerMetadata, index) => (
							<div
								key={index}
								style={{backgroundColor: speakerMetadata.color}}
								className="grid grid-rows-[1fr,auto] rounded-md"
							>
								<div className="flex justify-center items-center">
									<div className="relative">
										<Img
											src={speakerMetadata.picture}
											className="size-32 rounded-full shadow-xl"
										/>

										{speakers[speakerMetadata.speakerLabel].map(
											(segment, index) => (
												<Sequence
													key={index}
													from={segment.startFrame}
													durationInFrames={
														segment.stopFrame -
														segment.startFrame +
														EXIT_ANIMATION_DURATION_IN_FRAMES // Be sure the exit animation won't be truncated by extending the duration of the sequence
													}
												>
													<GreenRing
														startFrame={segment.startFrame}
														stopFrame={segment.stopFrame}
													/>
												</Sequence>
											)
										)}
									</div>
								</div>

								<div>
									<p className="px-2 py-0.5 text-white bg-zinc-900/20">
										{speakerMetadata.name}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</AbsoluteFill>

			<Audio src={staticFile('/podcast.m4a')} />
		</>
	);
};

function GreenRing({
	startFrame,
	stopFrame,
}: {
	startFrame: number;
	stopFrame: number;
}) {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const enter = spring({
		frame,
		fps,
		durationInFrames: EXIT_ANIMATION_DURATION_IN_FRAMES,
	});
	const exit = spring({
		frame,
		fps,
		durationInFrames: EXIT_ANIMATION_DURATION_IN_FRAMES,
		/**
		 * The delay will make the exit animation start after the segment ends.
		 * This will give the look that the animation starts when the speakers
		 * starts talking, but takes some time to fade out when the speaker stops
		 * talking.
		 */
		delay: stopFrame - startFrame,
	});

	/**
	 * See this post about making an exit animation with Remotion:
	 * https://discord.com/channels/809501355504959528/1205135451812536431/1205135451812536431
	 */
	const animation = enter - exit;

	return (
		<div
			className="w-full h-full rounded-full ring-green-400 ring-4"
			style={{opacity: animation}}
		/>
	);
}
