import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const Logo: React.FC<{
	logoColor: string;
}> = ({logoColor}) => {
	const frame = useCurrentFrame();
	const {height, fps} = useVideoConfig();

	const entrance = spring({
		fps,
		frame,
		config: {
			damping: 200,
		},
		durationInFrames: 30,
	});

	const entranceOffset = interpolate(entrance, [0, 1], [height, 0]);

	const wave1 = Math.cos(frame / 15) * 10 + entranceOffset;
	const wave2 = Math.cos((frame - 5) / 15) * 10 + entranceOffset;

	return (
		<div>
			<svg
				style={{transform: `translateY(${wave1}px)`}}
				className="absolute"
				height={120}
				viewBox="0 0 51 31"
			>
				<path
					d="M0 25.364C1.701 18.6 5.954 15.218 12.758 15.218C19.0815 15.218 21.9775 18.1395 24.4794 20.6634L24.48 20.664C26.015 22.213 27.403 23.613 29.344 24.096C32.746 24.941 35.723 23.673 38.275 20.291C36.574 27.055 32.321 30.436 25.517 30.436C19.1925 30.436 16.2975 27.5155 13.7956 24.9916L13.795 24.991C12.26 23.441 10.872 22.041 8.93 21.559C5.529 20.714 2.552 21.982 0 25.364Z"
					style={{fill: logoColor}}
				/>
			</svg>
			<svg
				style={{transform: `translateY(${wave2}px)`}}
				height={120}
				viewBox="0 0 51 31"
			>
				<path
					d="M12 10.146C13.701 3.382 17.954 0 24.758 0C31.0815 0 33.9775 2.92151 36.4794 5.44536L36.48 5.446C38.015 6.995 39.403 8.395 41.344 8.878C44.746 9.723 47.723 8.455 50.275 5.073C48.574 11.837 44.321 15.218 37.517 15.218C31.1925 15.218 28.2975 12.2975 25.7956 9.77365L25.795 9.773C24.26 8.223 22.872 6.823 20.93 6.341C17.529 5.496 14.552 6.764 12 10.146Z"
					style={{fill: logoColor}}
				/>
			</svg>
		</div>
	);
};
