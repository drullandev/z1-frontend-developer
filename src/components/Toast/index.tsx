import React from 'react'
import { ToastStyle } from './styles'
import { ToastProps } from './types'
import Icon from '../Icon/index'

/**
 * This component allow to set a loader witw less efforts
 * TODO: Requires better explanation! Also is not absolutely mature or definitive feature, only a testing workaround/yagni for the code cience ^^!
 * @param ToastProps
 * @returns 
 */
const MyToast: React.FC<ToastProps> = ({ icon, message, color, height, proportion }) =>
	<ToastStyle	color={`${color}`}>
		<Icon icon={icon} /> {message}
	</ToastStyle>

export default MyToast
