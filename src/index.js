import * as d3 from 'd3'
import * as c from './colors'
import { SmallMultiplesVis } from './small-multiples-vis'
import './index.scss'

function transformData(rows) {
	const data = rows
		.filter(r => {
			return r.Industry.includes('employment')
		})
		.map(row => {
			const industry = row.Industry,
				values = Object.entries(row)
					.slice(1)
					.map(d => [new Date(d[0]), d[1]])
			return {
				industry,
				values
			}
		})

	console.log(data)
	return data
}

const renderSmallMultiples = SmallMultiplesVis()

d3
	.csv('data/ma-employment-by-industry.csv')
	.row(r => {
		return r
	})
	.get(data => {
		d3
			.select('#main')
			.datum(transformData(data))
			.call(renderSmallMultiples)
	})
