import React from 'react'
import { NoticeStyle } from './styles'
import { NoticeProps } from './types'
import Icon from '../Icon/index'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'

/**
 * A simple notice component
 * TODO: Requires better explanation! Also is not absolutely mature or definitive feature, only a testing workaround/yagni for the code cience ^^!
 * @param ToastProps
 * @returns 
 */
const MyNotice: React.FC<NoticeProps> = ({ params  }) =>{

	return <NoticeStyle show={params.show}>
		<Icon color={params.color} icon={params.iconNotice ?? faCoffee}/> {params.message}
	</NoticeStyle>

}

export default MyNotice
