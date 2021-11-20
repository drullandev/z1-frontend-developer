import React from 'react'
import { ToastStyle } from './styles'
import { ToastProps } from './types'
import Icon from '../Icon/index'

/**
 * This is a very simple toast under construction...
 * TODO: Requires better explanation! Also is not absolutely mature or definitive feature, only a testing workaround/yagni for the code cience ^^!
 * @param ToastProps
 * @returns 
 */
const MyToast: React.FC<ToastProps> = ({ params  }) =>
	 <ToastStyle show={params.show} color={`${params.color}`}>
		<Icon icon={params.iconToast} /> {params.label}
	</ToastStyle>

export default MyToast
