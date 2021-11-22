import React from 'react'
import ContentLoader from 'react-content-loader'
import { LoaderProps, FieldProps } from './types'
import './styles'

/**
 * This component allow to set a loader witw less efforts
 * //TODO: Requires better explanation! Also is not absolutely mature or definitive feature, only a testing workaround/yagni for the code cience ^^!
 * @param LoaderProps
 * @returns 
 */
const Loader: React.FC<LoaderProps> = ({ params }) => {
	return (
		<ContentLoader {...params.config}>
			{params.fields.map((row: FieldProps, index: number) => {
				return row.style === 'circle' //TODO: Learn how-to to do better this case than with a predefined cascade of ternary
					? <circle key={index} cx={row.r + 2} cy={row.r + 2} r={row.r} />
					: <rect
						key={index}
						x={row.x * params.width}
						y={row.y * params.height + index * params.margin}
						width={row.width}
						rx={params.rx}
						ry={params.ry}
						height={params.height}
					/>
			})}
		</ContentLoader>
	)
}

export default Loader
