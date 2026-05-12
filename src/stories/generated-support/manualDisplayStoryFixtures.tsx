import React from 'react';

import {
	previewParticipants,
	previewMember,
	previewCoHost,
	previewRoomName,
	previewMeetingSocket,
	previewCoHostResponsibilities,
	previewWhiteboardUsers,
} from './modernStorybookFixtures';

export const previewPrimaryParticipant = {
	...previewParticipants[1],
	id: previewParticipants[1]?.id || 'storybook-primary-participant',
	name: previewParticipants[1]?.name || 'Ivy',
	muted: false,
	videoOn: true,
	islevel: previewParticipants[1]?.islevel || '0',
};

export const previewSecondaryParticipant = {
	...previewParticipants[2],
	id: previewParticipants[2]?.id || 'storybook-secondary-participant',
	name: previewParticipants[2]?.name || 'Rachel',
	muted: false,
	videoOn: false,
	islevel: previewParticipants[2]?.islevel || '0',
};

export const previewDisplayAudioLevels = [
	{ name: previewPrimaryParticipant.name, averageLoudness: 182 },
	{ name: previewSecondaryParticipant.name, averageLoudness: 168 },
	{ name: previewMember, averageLoudness: 142 },
];

export function createPreviewCanvasStream(options?: {
	title?: string;
	width?: number;
	height?: number;
	gradientStops?: [number, string][];
}) {
	const canvas = document.createElement('canvas');
	canvas.width = options?.width || 1280;
	canvas.height = options?.height || 720;

	const context = canvas.getContext('2d');
	let frame = 0;
	let animationFrame = 0;

	const renderFrame = () => {
		if (!context) {
			return;
		}

		frame += 1;

		const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
		const gradientStops = options?.gradientStops || [
			[0, '#0f172a'],
			[0.45, '#1d4ed8'],
			[1, '#22c55e'],
		];

		gradientStops.forEach(([stop, color]) => gradient.addColorStop(stop, color));

		context.fillStyle = gradient;
		context.fillRect(0, 0, canvas.width, canvas.height);

		context.fillStyle = 'rgba(255,255,255,0.12)';
		context.beginPath();
		context.arc(200 + Math.sin(frame / 20) * 30, 180, 84, 0, Math.PI * 2);
		context.fill();

		context.fillStyle = 'rgba(255,255,255,0.08)';
		context.beginPath();
		context.arc(1020, 500 + Math.cos(frame / 24) * 26, 132, 0, Math.PI * 2);
		context.fill();

		context.fillStyle = '#f8fafc';
		context.font = '700 44px Georgia, serif';
		context.fillText(options?.title || 'MediaSFU Storybook Stream', 64, 110);

		context.fillStyle = 'rgba(248,250,252,0.86)';
		context.font = '500 24px Georgia, serif';
		context.fillText('Canvas-backed preview media for visual stories', 64, 152);

		context.fillStyle = 'rgba(15,23,42,0.55)';
		context.fillRect(64, 560, 340, 88);

		context.fillStyle = '#e2e8f0';
		context.font = '600 22px Georgia, serif';
		context.fillText(`Frame ${frame}`, 92, 612);

		animationFrame = window.requestAnimationFrame(renderFrame);
	};

	renderFrame();

	const stream = typeof canvas.captureStream === 'function' ? canvas.captureStream(12) : new MediaStream();

	return {
		stream,
		dispose: () => {
			window.cancelAnimationFrame(animationFrame);
			stream.getTracks().forEach((track) => track.stop());
		},
	};
}

export function createPreviewDisplayParameters(overrides?: Record<string, unknown>) {
	const parameters: Record<string, unknown> = {
		audioDecibels: previewDisplayAudioLevels,
		participants: [previewPrimaryParticipant, previewSecondaryParticipant, ...previewParticipants.slice(3)],
		socket: previewMeetingSocket,
		coHostResponsibility: previewCoHostResponsibilities,
		roomName: previewRoomName,
		showAlert: (alert?: { message?: string; type?: string }) => {
			if (alert?.message) {
				console.info(`Display Storybook Alert (${alert.type || 'info'}): ${alert.message}`);
			}
		},
		coHost: previewCoHost,
		member: previewMember,
		islevel: '2',
		eventType: 'conference',
		...overrides,
	};

	parameters.getUpdatedAllParams = () => parameters;

	return parameters;
}

export function createPreviewWhiteboardSocket() {
	return {
		id: 'storybook-whiteboard-socket',
		emit: (...args: unknown[]) => {
			const callback = args[args.length - 1];
			if (typeof callback === 'function') {
				callback({ success: true });
			}
		},
		on: () => undefined,
		off: () => undefined,
	};
}

export const previewWhiteboardShapes = [
	{
		type: 'rectangle',
		x1: 120,
		y1: 120,
		x2: 540,
		y2: 320,
		color: '#2563eb',
		thickness: 4,
		lineType: 'solid',
	},
	{
		type: 'text',
		x: 180,
		y: 220,
		text: 'Storyboard ideas',
		color: '#0f172a',
		font: 'Georgia',
		fontSize: 34,
	},
	{
		type: 'freehand',
		color: '#dc2626',
		thickness: 5,
		points: [
			{ x: 620, y: 210 },
			{ x: 690, y: 180 },
			{ x: 760, y: 240 },
			{ x: 860, y: 200 },
		],
	},
];

export function buildWhiteboardParameters(state: {
	shapes: unknown[];
	setShapes: (value: unknown[]) => void;
	useImageBackground: boolean;
	setUseImageBackground: (value: boolean) => void;
	redoStack: unknown[];
	setRedoStack: (value: unknown[]) => void;
	undoStack: string[];
	setUndoStack: (value: string[]) => void;
	whiteboardStarted: boolean;
	setWhiteboardStarted: (value: boolean) => void;
	whiteboardEnded: boolean;
	setWhiteboardEnded: (value: boolean) => void;
	whiteboardUsers: unknown[];
	setWhiteboardUsers: (value: unknown[]) => void;
	participants: unknown[];
	setParticipants: (value: unknown[]) => void;
	screenId: string;
	setScreenId: (value: string) => void;
	shareScreenStarted: boolean;
	setShareScreenStarted: (value: boolean) => void;
	setCanvasWhiteboard: (value: HTMLCanvasElement | null) => void;
}) {
	const parameters: Record<string, unknown> = {
		socket: createPreviewWhiteboardSocket(),
		showAlert: (alert?: { message?: string; type?: string }) => {
			if (alert?.message) {
				console.info(`Whiteboard Storybook Alert (${alert.type || 'info'}): ${alert.message}`);
			}
		},
		islevel: '2',
		roomName: previewRoomName,
		shapes: state.shapes,
		useImageBackground: state.useImageBackground,
		redoStack: state.redoStack,
		undoStack: state.undoStack,
		whiteboardStarted: state.whiteboardStarted,
		whiteboardEnded: state.whiteboardEnded,
		whiteboardUsers: state.whiteboardUsers,
		participants: state.participants,
		participantsAll: state.participants,
		screenId: state.screenId,
		recordStarted: false,
		recordStopped: false,
		recordPaused: false,
		recordResumed: false,
		recordingMediaOptions: 'all',
		member: previewMember,
		shareScreenStarted: state.shareScreenStarted,
		targetResolution: 'hd',
		targetResolutionHost: 'hd',
		isDarkModeValue: true,
		updateShapes: state.setShapes,
		updateUseImageBackground: state.setUseImageBackground,
		updateRedoStack: state.setRedoStack,
		updateUndoStack: state.setUndoStack,
		updateWhiteboardStarted: state.setWhiteboardStarted,
		updateWhiteboardEnded: state.setWhiteboardEnded,
		updateWhiteboardUsers: state.setWhiteboardUsers,
		updateParticipants: state.setParticipants,
		updateScreenId: state.setScreenId,
		updateShareScreenStarted: state.setShareScreenStarted,
		updateCanvasWhiteboard: state.setCanvasWhiteboard,
		onScreenChanges: async () => undefined,
		captureCanvasStream: async () => undefined,
	};

	parameters.getUpdatedAllParams = () => parameters;

	return parameters;
}

export const previewWhiteboardParticipants = [previewPrimaryParticipant, previewSecondaryParticipant, ...previewParticipants.slice(3)];
export const previewWhiteboardParticipantUsers = previewWhiteboardUsers.length ? previewWhiteboardUsers : [{ name: previewPrimaryParticipant.name, useBoard: true }];
