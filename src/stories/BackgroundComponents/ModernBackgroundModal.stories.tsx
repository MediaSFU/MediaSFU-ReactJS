import React, { useEffect, useRef, useState } from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';

import { ModernBackgroundModal } from '../../components_modern/background_components/ModernBackgroundModal';

const fullscreenDecorator: Decorator = (Story) => (
	<div
		style={{
			minHeight: '100vh',
			padding: 24,
			background:
				'radial-gradient(circle at top left, rgba(14, 165, 233, 0.22), transparent 30%), linear-gradient(135deg, #020617, #0f172a 52%, #111827)',
		}}
	>
		<Story />
	</div>
);

function stopStream(stream: MediaStream | null) {
	stream?.getTracks().forEach((track) => track.stop());
}

function createPreviewStream() {
	const canvas = document.createElement('canvas');
	canvas.width = 1280;
	canvas.height = 720;

	const context = canvas.getContext('2d');
	let frame = 0;
	let animationFrame = 0;

	const renderFrame = () => {
		if (!context) {
			return;
		}

		frame += 1;

		const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
		gradient.addColorStop(0, '#0f172a');
		gradient.addColorStop(0.5, '#1d4ed8');
		gradient.addColorStop(1, '#0ea5e9');

		context.fillStyle = gradient;
		context.fillRect(0, 0, canvas.width, canvas.height);

		context.fillStyle = 'rgba(255, 255, 255, 0.16)';
		context.beginPath();
		context.arc(240 + Math.sin(frame / 18) * 36, 220, 90, 0, Math.PI * 2);
		context.fill();

		context.fillStyle = 'rgba(255, 255, 255, 0.10)';
		context.beginPath();
		context.arc(970, 460 + Math.cos(frame / 24) * 28, 120, 0, Math.PI * 2);
		context.fill();

		context.fillStyle = '#f8fafc';
		context.font = '700 46px Georgia, serif';
		context.fillText('MediaSFU Preview Stream', 72, 112);

		context.fillStyle = 'rgba(248, 250, 252, 0.86)';
		context.font = '500 26px Georgia, serif';
		context.fillText('Canvas-backed mock video for Storybook background testing', 72, 156);

		context.fillStyle = 'rgba(15, 23, 42, 0.55)';
		context.fillRect(72, 540, 420, 92);

		context.fillStyle = '#e2e8f0';
		context.font = '600 24px Georgia, serif';
		context.fillText(`Frame ${frame}`, 96, 592);

		animationFrame = window.requestAnimationFrame(renderFrame);
	};

	renderFrame();

	const stream = typeof canvas.captureStream === 'function' ? canvas.captureStream(12) : new MediaStream();

	return {
		stream,
		dispose: () => {
			window.cancelAnimationFrame(animationFrame);
			stopStream(stream);
		},
	};
}

function createMockSegmentation() {
	let resultHandler: ((results: { segmentationMask: CanvasImageSource; image: CanvasImageSource }) => void) | null = null;

	return {
		onResults: (handler: (results: { segmentationMask: CanvasImageSource; image: CanvasImageSource }) => void) => {
			resultHandler = handler;
		},
		send: async ({ image }: { image: CanvasImageSource }) => {
			resultHandler?.({ segmentationMask: image, image });
		},
		close: () => {
			resultHandler = null;
		},
	};
}

function BackgroundModalPreview() {
	const [previewStream, setPreviewStream] = useState<MediaStream | null>(null);
	const [customImage, setCustomImage] = useState('');
	const [selectedImage, setSelectedImage] = useState('https://mediasfu.com/images/backgrounds/wall_small.jpg');
	const [segmentVideo, setSegmentVideo] = useState<MediaStream | null>(null);
	const [selfieSegmentation, setSelfieSegmentation] = useState<any>(() => createMockSegmentation());
	const [pauseSegmentation, setPauseSegmentation] = useState(false);
	const [processedStream, setProcessedStream] = useState<MediaStream | null>(null);
	const [keepBackground, setKeepBackground] = useState(false);
	const [backgroundHasChanged, setBackgroundHasChanged] = useState(false);
	const [virtualStream, setVirtualStream] = useState<MediaStream | null>(null);
	const [prevKeepBackground, setPrevKeepBackground] = useState(false);
	const [appliedBackground, setAppliedBackground] = useState(false);
	const [videoParams, setVideoParams] = useState<any>({});
	const [autoClickBackground, setAutoClickBackground] = useState(false);
	const latestStreamsRef = useRef({
		previewStream: null as MediaStream | null,
		segmentVideo: null as MediaStream | null,
		processedStream: null as MediaStream | null,
		virtualStream: null as MediaStream | null,
	});

	latestStreamsRef.current = {
		previewStream,
		segmentVideo,
		processedStream,
		virtualStream,
	};

	useEffect(() => {
		const previewSession = createPreviewStream();
		setPreviewStream(previewSession.stream);

		return () => {
			previewSession.dispose();
			Object.values(latestStreamsRef.current).forEach((stream) => stopStream(stream));
		};
	}, []);

	const previewParameters: any = {
		customImage,
		selectedImage,
		segmentVideo,
		selfieSegmentation,
		pauseSegmentation,
		processedStream,
		keepBackground,
		backgroundHasChanged,
		virtualStream,
		mainCanvas: null,
		prevKeepBackground,
		appliedBackground,
		videoAlreadyOn: Boolean(previewStream),
		audioOnlyRoom: false,
		islevel: '2',
		recordStarted: false,
		recordResumed: false,
		recordPaused: false,
		recordStopped: false,
		recordingMediaOptions: 'all',
		mediaDevices: {
			getUserMedia: async () => previewStream ?? new MediaStream(),
		} as MediaDevices,
		showAlert: (alert: { message?: string; type?: string }) => {
			if (alert?.message) {
				console.info(`Background Storybook Alert (${alert.type || 'info'}): ${alert.message}`);
			}
		},
		localStreamVideo: previewStream,
		vidCons: { width: 1280, height: 720 },
		frameRate: 12,
		targetResolution: 'hd',
		updateCustomImage: setCustomImage,
		updateSelectedImage: setSelectedImage,
		updateSegmentVideo: setSegmentVideo,
		updateSelfieSegmentation: setSelfieSegmentation,
		updatePauseSegmentation: setPauseSegmentation,
		updateProcessedStream: setProcessedStream,
		updateKeepBackground: setKeepBackground,
		updateBackgroundHasChanged: setBackgroundHasChanged,
		updateVirtualStream: setVirtualStream,
		updatePrevKeepBackground: setPrevKeepBackground,
		updateAppliedBackground: setAppliedBackground,
		videoProducer: null,
		transportCreated: false,
		videoParams,
		updateVideoParams: setVideoParams,
		autoClickBackground,
		updateAutoClickBackground: setAutoClickBackground,
		createSendTransport: async () => undefined,
		connectSendTransportVideo: async () => undefined,
		disconnectSendTransportVideo: async () => undefined,
		onScreenChanges: async () => undefined,
		sleep: async () => undefined,
	};

	previewParameters.getUpdatedAllParams = () => previewParameters;

	return (
		<ModernBackgroundModal
			isVisible
			onClose={() => undefined}
			parameters={previewParameters}
			captureVideoProps={{ autoPlay: true, muted: true, playsInline: true }}
			previewVideoProps={{ autoPlay: true, muted: true, playsInline: true }}
		/>
	);
	}

const meta = {
	title: 'Background Components/Modern Background Modal',
	component: ModernBackgroundModal,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
	},
	decorators: [fullscreenDecorator],
} satisfies Meta<typeof ModernBackgroundModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		isVisible: true,
		onClose: () => undefined,
		parameters: {} as any,
	},
	render: () => <BackgroundModalPreview />,
};