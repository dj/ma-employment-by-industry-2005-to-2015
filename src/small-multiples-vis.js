import * as d3 from 'd3'
import * as c from './colors'
import months from './months'

export function SmallMultiplesVis() {
	let width = 0,
		height = 150,
		start = new Date('Jan 2005'),
		end = new Date('Dec 2015'),
		margin = {
			top: 50,
			right: 20,
			bottom: 30,
			left: 20
		}
	let rect

	function render(selection) {
		rect = selection.node().getBoundingClientRect()
		width = rect.width / 2 - margin.left - margin.right
		height = height - margin.top - margin.bottom
		// xScale will be the same for every multiple
		const xScale = d3
			.scaleTime()
			.domain([start, end])
			.range([0, width])

		selection.each(function(data) {
			// Eagerly calculate all the y scales for each industry
			const yScale = {}
			const area = {}
			const line = {}
			data.forEach(row => {
				yScale[row.industry] = d3
					.scaleLinear()
					.domain([row.max, row.min * 0.9])
					.range([0, height])
				area[row.industry] = d3
					.area()
					.x(d => xScale(new Date(d[0])))
					.y0(height)
					.y1(d => yScale[row.industry](d[1]))
				line[row.industry] = d3
					.area()
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
				.attr('width', rect.width / 2)
				.attr('class', d => {
					return `chart ${d.industry}`
				})

			const group = chart
				.append('g')
				.attr('width', width)
				.attr('transform', 'translate(0,0)')
				.attr('transform', `translate(${margin.left},${margin.top})`)
				.attr('class', d => d.industry)

			// x axis labels
			group
				.append('text')
				.text('2005')
				.attr('y', height + 20)

			group
				.append('text')
				.attr('y', height + 20)
				.attr('x', width - 35)
				.text('2015')

			// industry label
			group
				.append('text')
				.text(d => d.label)
				.attr('y', -20)
				.style('color', c.themePrimary3)

			// area
			group
				.append('path')
				.style('stroke', c.themePrimary2)
				.style('fill', c.themePrimary2)
				.style('opacity', 0.3)
				.attr('d', d => {
					return area[d.industry](d.values)
				})
				.style('stroke-width', 1.15)

			// plot lines
			group
				.append('path')
				.style('stroke', c.themePrimary2)
				.attr('d', d => {
					return line[d.industry](d.values)
				})
				.style('stroke-width', 1)

			// cursor: hightlight selected datum
			const cursor = group
				.append('line')
				.attr('stroke', c.themePrimary3)
				.attr('class', 'pointer')
				.attr('opacity', 0)
				.attr('stroke-width', 1.5)
				.style('fill', c.themePrimary3)

			// current year
			const year = group.append('text').attr('opacity', 0)

			const mousemove = () => {
				const x = d3.mouse(this)[0]
				const date = xScale.invert(x)
				cursor.attr('x1', x)
				cursor.attr('y1', -2)
				cursor.attr('x2', x)
				cursor.attr('y2', height)
				year.text(`${months[date.getMonth()]} ${date.getFullYear()}`)
				year.attr('x', x - 25)
				year.attr('y', -5)
				year.style('stroke', c.themePrimary1)
				// TODO: finish calculating y position
				// cursor.attr('cy', d => {
				// 	const y = yScale[d.industry](date) * -1
				// 	console.log('date, y', date, y)
				// 	return y
				// })
				date.setDate(1)
				date.setHours(0, 0, 0, 0)
			}

			const mouseover = () => {
				cursor.attr('opacity', 1)
				year.attr('opacity', 1)
				mousemove.call(this)
			}

			const mouseout = () => {
				cursor.attr('opacity', 0)
				year.attr('opacity', 0)
			}

			group
				.on('mousemove', mousemove)
				.on('mouseover', mouseover)
				.on('mouseout', mouseout)
		})
	}

	return render
}
