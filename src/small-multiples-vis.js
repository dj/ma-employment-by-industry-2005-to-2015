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
			// Eagerly calculate all the y scales for each industry
			const yScale = {}
			const line = {}
			data.forEach(row => {
				yScale[row.industry] = d3
					.scaleLinear()
					.domain([row.min, row.max])
					.range([0, height])
				line[row.industry] = d3
					.line()
					.x(d => xScale(new Date(d[0])))
					.y(d => yScale[row.industry](d[1]))
			})

			// Select our visualization container and bind our data to each chart svg
			const container = d3
				.select(this)
				.selectAll('.chart')
				.data(data)

			// Create an svg for each datum
			container
				.enter()
				.append('svg')
				.attr('class', function(d) {
					return `chart ${d.industry}`
				})
				.append('path')
				.style('stroke', 'steelblue')
				.style('fill', 'none')
				.attr('d', function(d) {
					console.log('attr d:', d)
					return line[d.industry](d.values)
				})
		})
	}

	return render
}
