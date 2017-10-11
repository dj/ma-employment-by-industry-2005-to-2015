import * as d3 from 'd3'
import * as c from './colors'
import { SmallMultiplesVis } from './small-multiples-vis'
import './index.scss'

function transformData(rows) {
	const data = rows.map(row => {
		const industry = row.Industry
		const min = row.Min
		const max = row.Max

		delete row.Industry
		delete row.Min
		delete row.Max

		// The remaining keys in row are all dates, convert to an array of [Date, Number]
		const values = Object.entries(row).map(d => {
			return [new Date(d[0]), d[1]]
		})

		return {
			industry,
			min,
			max,
			values
		}
	})

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
