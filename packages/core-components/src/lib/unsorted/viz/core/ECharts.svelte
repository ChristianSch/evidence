<script context="module">
	export const evidenceInclude = true;
</script>

<script>
	import { browser } from '$app/environment';
	import echarts from '@evidence-dev/component-utilities/echarts';
	import echartsCanvasDownload from '@evidence-dev/component-utilities/echartsCanvasDownload';
	import EChartsCopyTarget from './EChartsCopyTarget.svelte';
	import DownloadData from '../../ui/DownloadData.svelte';
	import CodeBlock from '../../ui/CodeBlock.svelte';
	import ChartLoading from '../../ui/ChartLoading.svelte';
	import { flush } from 'svelte/internal';
	import { createEventDispatcher } from 'svelte';

	export let config = undefined;

	export let queryID = undefined;
	export let evidenceChartTitle = undefined;

	export let height = '291px';
	export let width = '100%';

	export let data;

	export let echartsOptions = undefined;
	export let printEchartsConfig; // helper for custom chart development

	const dispatch = createEventDispatcher();

	let downloadChart = false;
	let copying = false;
	let printing = false;
	let hovering = false;
</script>

<svelte:window
	on:copy={() => {
		copying = true;
		flush();
		setTimeout(() => {
			copying = false;
		}, 0);
	}}
	on:beforeprint={() => (printing = true)}
	on:afterprint={() => (printing = false)}
	on:export-beforeprint={() => (printing = true)}
	on:export-afterprint={() => (printing = false)}
/>

<div
	class="chart-container"
	on:mouseenter={() => (hovering = true)}
	on:mouseleave={() => (hovering = false)}
>
	{#if !printing}
		{#if !browser}
			<ChartLoading {height} />
		{:else}
			<div
				class="chart"
				style="
				height: {height};
				width: {width};
				margin-left: 0;
				margin-top: 15px;
				margin-bottom: 10px;
				overflow: visible;
				display: {copying ? 'none' : 'inherit'}
			"
				use:echarts={{ ...config, ...$$restProps, echartsOptions, dispatch }}
			/>
		{/if}
	{/if}

	<EChartsCopyTarget {config} {height} {width} {copying} {printing} {echartsOptions} />

	<div class="chart-footer">
		<DownloadData
			text="Save image"
			class="download-button"
			downloadData={() => {
				downloadChart = true;
				setTimeout(() => {
					downloadChart = false;
				}, 0);
			}}
			display={hovering}
			{queryID}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="12"
				height="12"
				viewBox="0 0 24 24"
				fill="none"
				stroke="#000"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path
					d="M20.4 14.5L16 10 4 20"
				/></svg
			>
		</DownloadData>
		{#if data}
			<DownloadData
				text="Download data"
				{data}
				{queryID}
				class="download-button"
				display={hovering}
			/>
		{/if}
	</div>

	{#if printEchartsConfig && !printing}
		<CodeBlock>
			{JSON.stringify(config, undefined, 3)}
		</CodeBlock>
	{/if}
</div>

{#if downloadChart}
	<div
		class="chart"
		style="
        display: none;
        visibility: visible;
        height: {height};
        width: 666px;
        margin-left: 0;
        margin-top: 15px;
        margin-bottom: 15px;
        overflow: visible;
    "
		use:echartsCanvasDownload={{
			...config,
			...$$restProps,
			echartsOptions,
			queryID,
			evidenceChartTitle
		}}
	/>
{/if}

<style>
	@media print {
		.chart {
			break-inside: avoid;
		}

		.chart-container {
			padding: 0;
		}
	}
	.chart {
		-moz-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
		-o-user-select: none;
		user-select: none;
	}

	.chart-footer {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		margin: 3px 12px;
		font-size: 12px;
		height: 9px;
	}
</style>
