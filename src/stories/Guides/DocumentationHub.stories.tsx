import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { mediaSFUDocsSections } from '../../../.storybook/links';

const pageStyle: CSSProperties = {
	minHeight: '100vh',
	padding: '40px',
	background: 'linear-gradient(180deg, #04131f 0%, #071c2d 55%, #0b2d38 100%)',
	color: '#e6f2fb',
	fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

const heroStyle: CSSProperties = {
	maxWidth: 960,
	margin: '0 auto 32px',
	display: 'grid',
	gap: 16,
};

const gridStyle: CSSProperties = {
	maxWidth: 960,
	margin: '0 auto',
	display: 'grid',
	gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
	gap: 16,
};

const cardStyle: CSSProperties = {
	padding: 20,
	borderRadius: 18,
	border: '1px solid rgba(113, 212, 255, 0.25)',
	background: 'rgba(8, 23, 37, 0.82)',
	boxShadow: '0 20px 40px rgba(2, 6, 23, 0.22)',
	display: 'grid',
	gap: 12,
};

const linkStyle: CSSProperties = {
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	padding: '10px 14px',
	borderRadius: 999,
	background: '#1ec0b8',
	color: '#042033',
	fontWeight: 700,
	textDecoration: 'none',
};

function DocumentationHub() {
	return (
		<div style={pageStyle}>
			<div style={heroStyle}>
				<p
					style={{
						margin: 0,
						textTransform: 'uppercase',
						letterSpacing: 1.4,
						fontSize: 12,
						color: '#71d4ff',
					}}
				>
					One system, two surfaces
				</p>
				<h1 style={{ margin: 0, fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}>
					MediaSFU docs and Storybook should work together.
				</h1>
				<p style={{ margin: 0, maxWidth: 760, color: '#c7d8e8', fontSize: 18, lineHeight: 1.6 }}>
					Use the docs portal for onboarding, integration paths, backend-safe setup, and API lookup.
					Use Storybook for visual inspection of cards, controls, whiteboard flows, and overrideable UI surfaces.
				</p>
			</div>

			<div style={gridStyle}>
				<div style={cardStyle}>
					<h2 style={{ margin: 0, fontSize: 22 }}>Docs portal</h2>
					<p style={{ margin: 0, color: '#c7d8e8', lineHeight: 1.6 }}>
						Start here for the narrative flow: quickstart, secure backend proxying, build-style choice,
						 and starter screens.
					</p>
					<a href={mediaSFUDocsSections.overview} style={linkStyle} target="_blank" rel="noreferrer">
						Open docs portal
					</a>
				</div>

				<div style={cardStyle}>
					<h2 style={{ margin: 0, fontSize: 22 }}>Secure first</h2>
					<p style={{ margin: 0, color: '#c7d8e8', lineHeight: 1.6 }}>
						Production create and join flows should run through your backend, not expose MediaSFU credentials in the frontend.
					</p>
					<a href={mediaSFUDocsSections.secureBackend} style={linkStyle} target="_blank" rel="noreferrer">
						Read secure backend guide
					</a>
				</div>

				<div style={cardStyle}>
					<h2 style={{ margin: 0, fontSize: 22 }}>Choose the right abstraction</h2>
					<p style={{ margin: 0, color: '#c7d8e8', lineHeight: 1.6 }}>
						Use the build-style guide before jumping from prebuilt UI to overrides, custom components, or headless mode.
					</p>
					<a href={mediaSFUDocsSections.buildStyle} style={linkStyle} target="_blank" rel="noreferrer">
						Open build-style guide
					</a>
				</div>

				<div style={cardStyle}>
					<h2 style={{ margin: 0, fontSize: 22 }}>API lookup</h2>
					<p style={{ margin: 0, color: '#c7d8e8', lineHeight: 1.6 }}>
						When you need exact props, helpers, or types, move from Storybook to the API reference and then back here for visual confirmation.
					</p>
					<a href={mediaSFUDocsSections.apiReference} style={linkStyle} target="_blank" rel="noreferrer">
						Open API reference
					</a>
				</div>
			</div>
		</div>
	);
}

const meta = {
	title: 'Guides/Documentation Hub',
	component: DocumentationHub,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'Use Storybook to inspect React UI surfaces, then return to the MediaSFU docs portal for SDK setup and production guidance.',
			},
		},
	},
	tags: ['autodocs'],
} satisfies Meta<typeof DocumentationHub>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};