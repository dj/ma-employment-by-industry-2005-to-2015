import * as d3 from 'd3'

export function SmallMultiplesVis() {
	const width = 500,
		height = 60,
		start = new Date('Jan 2005'),
		end = new Date('Dec 2015')

	// xScale will be the same for every multiple
	const xScale = d3
		.scaleTime()
		.domain([start, end])
		.range([0, width])

	function render(selection) {
		selection.each(function(data) {
			console.log('data:', data)

			// Select our visualization container and bind our data to each chart svg
			const container = d3
				.select(this)
				.selectAll('.chart')
				.data(data)

			// Create an svg for each datum
			container
				.enter()
				.append('svg')
				.attr('class', 'chart')
		})
	}

	return render
}
