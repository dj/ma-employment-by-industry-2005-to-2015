import * as d3 from 'd3'
import * as c from './colors'
import { SmallMultiplesVis } from './small-multiples-vis'
import './index.scss'

function transformData(rows) {
	const data = rows.map(row => {
		const label = row.Industry
		const industry = row.Industry.toLowerCase().split(' ')[0]
		const min = row.Min
		const max = row.Max

		delete row.Industry
		delete row.Min
		delete row.Max

		const values = Object.entries(row)

		return {
			label,
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
