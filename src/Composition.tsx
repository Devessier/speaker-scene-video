import {
	AbsoluteFill,
	Audio,
	Img,
	Sequence,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {z} from 'zod';

export const myCompSchema = z.object({
	speakers: z.record(
		z.array(z.object({startFrame: z.number(), stopFrame: z.number()}))
	),
});

const ANIMATION_DURATION = 15;

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
						{speakersMetadata.map((speaker, index) => (
							<div
								key={index}
								style={{backgroundColor: speaker.color}}
								className="grid grid-rows-[1fr,auto] rounded-md"
							>
								<div className="flex justify-center items-center">
									<div className="relative">
										<Img
											src={speaker.picture}
											className="size-32 rounded-full shadow-xl"
										/>

										{speakers[speaker.speakerLabel].map((sequence, index) => (
											<Sequence
												key={index}
												from={sequence.startFrame}
												durationInFrames={
													sequence.stopFrame -
													sequence.startFrame +
													ANIMATION_DURATION
												}
											>
												<GreenRing />
											</Sequence>
										))}
									</div>
								</div>

								<div>
									<p className="px-2 py-0.5 text-white bg-zinc-900/20">
										{speaker.name}
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

function GreenRing() {
	const {fps} = useVideoConfig();
	const frame = useCurrentFrame();

	const enter = spring({
		fps,
		frame,
		durationInFrames: ANIMATION_DURATION,
	});

	return (
		<div
			className="ring-4 ring-green-400 w-full h-full rounded-full"
			style={{opacity: enter}}
		/>
	);
}
