import { init, registerMap } from 'echarts';
import usStateMap from './usStateMap.json';

export default (node, option) => {
	registerMap('US', usStateMap, {
		Alaska: {
			left: -128,
			top: 25,
			width: 12,
			height: 7
		},
		AK: {
			left: -128,
			top: 25,
			width: 12,
			height: 7
		},
		Hawaii: {
			left: -114,
			top: 26,
			width: 5
		},
		HI: {
			left: -114,
			top: 26,
			width: 5
		}
	});

	let hasLink = option.hasLink;

	let extraHeight = option.extraHeight;

	const chart = init(node, 'none', {
		renderer: 'canvas',
		height: `${node.clientWidth * 0.5 + extraHeight}`
	});

	if (node && node.parentNode) {
		// node.parentNode refers to the chart's container
		node.style.height = chart.getHeight() + 'px';
		node.parentNode.style.height = chart.getHeight() + 'px';
	}

	chart.setOption(option.config);
	// Check if echartsOptions are provided and apply them
	if (option.echartsOptions) {
		chart.setOption(option.echartsOptions);
	}

	let resizeObserver;
	const containerElement = document.querySelector('div.content > article');
	const resizeChart = () => {
		chart.resize({
			animation: {
				duration: 500
			},
			height: `${chart.getWidth() * 0.5 + extraHeight}`
		});
		// After resizing the chart, adjust the container's height
		if (node && node.parentNode) {
			// node.parentNode refers to the chart's container
			node.style.height = chart.getHeight() + 'px';
			node.parentNode.style.height = chart.getHeight() + 'px';
		}
	};

	if (hasLink) {
		chart.on('click', function (params) {
			if (params.data && params.data.link) {
				window.location = params.data.link;
			}
		});
	}

	if (window.ResizeObserver && containerElement) {
		resizeObserver = new ResizeObserver(resizeChart);
		resizeObserver.observe(containerElement);
	} else {
		window.addEventListener('resize', resizeChart);
	}

	return {
		update(option) {
			chart.setOption(option.config, true, true);
			// Check if echartsOptions are provided and apply them
			if (option.echartsOptions) {
				chart.setOption(option.echartsOptions);
			}
		},
		destroy() {
			if (resizeObserver) {
				resizeObserver.unobserve(containerElement);
			} else {
				window.removeEventListener('resize', resizeChart);
			}
			chart.dispose();
		}
	};
};
