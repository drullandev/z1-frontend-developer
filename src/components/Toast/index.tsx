import React, { useEffect, useState, } from 'react'
import { ToastStyle } from './styles'
import { ToastProps } from './types'
import Icon from '../Icon/index'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'

/**
 * This component allow to set a loader witw less efforts
 * TODO: Requires better explanation! Also is not absolutely mature or definitive feature, only a testing workaround/yagni for the code cience ^^!
 * @param ToastProps
 * @returns 
 */
const MyToast: React.FC<ToastProps> = ({ params  }) =>{

	const [show, setShow] = useState(false)
	const [faicon, setFaicon] = useState(faCoffee)
	const [message, setMessage] = useState('')
	const [color, setColor] = useState('')

	useEffect(()=>{
		setShow(params.show)
		setFaicon(params.icon)
		setMessage(params.message)
		setColor(params.color)
	},[params])

	return <ToastStyle show={params.show} color={`${color}`}>
		<Icon icon={faicon} /> {message}
	</ToastStyle>
}

export default MyToast
