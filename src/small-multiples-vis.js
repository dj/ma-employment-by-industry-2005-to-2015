import * as d3 from 'd3'
import * as c from './colors'

export function SmallMultiplesVis() {
	let width = 0,
		height = 150,
		start = new Date('Jan 2005'),
		end = new Date('Dec 2015'),
		margin = {
			top: 20,
			right: 20,
			bottom: 20,
			left: 20
		}
	let rect

	function render(selection) {
		rect = selection.node().getBoundingClientRect()
		width = rect.width - margin.left - margin.right
		height = height - margin.top - margin.bottom
		// xScale will be the same for every multiple
		const xScale = d3
			.scaleTime()
			.domain([start, end])
			.range([0, width])

		selection.each(function(data) {
			// Eagerly calculate all the y scales for each industry
			const yScale = {}
			const line = {}
			data.forEach(row => {
				yScale[row.industry] = d3
					.scaleLinear()
					.domain([row.max, row.min])
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
			const chart = container
				.enter()
				.append('svg')
				.attr('class', d => {
					return `chart ${d.industry}`
				})
				.append('g')
				.attr('transform', `translate(${margin.left},${margin.top})`)

			chart
				.append('path')
				.style('stroke', c.themePrimary2)
				.style('fill', 'none')
				.attr('d', d => {
					return line[d.industry](d.values)
				})

			chart
				.append('text')
				.text(d => d.label)
				.style('color', c.themePrimary3)
		})
	}

	return render
}
