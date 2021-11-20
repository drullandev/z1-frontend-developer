import React, { useEffect, useState, } from 'react'
import { NoticeStyle } from './styles'
import { NoticeProps } from './types'
import Icon from '../Icon/index'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'

/**
 * This component allow to set a loader witw less efforts
 * TODO: Requires better explanation! Also is not absolutely mature or definitive feature, only a testing workaround/yagni for the code cience ^^!
 * @param ToastProps
 * @returns 
 */
const MyNotice: React.FC<NoticeProps> = ({ params  }) =>{

	return <NoticeStyle show={params.show.toString()} color={`${params.color}`}>
		<Icon icon={params.faicon}/> {params.message}
	</NoticeStyle>

}

export default MyNotice
