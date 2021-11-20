
import React from 'react'
import { ButtonStyle, AppLinkStyle } from './styles'
import { ButtonProps } from './types'

/**
 * This is a simple button component
 * TODO: Requires better explanation! Also is not absolutely mature or definitive feature, only a testing workaround/yagni for the code cience ^^!
 * @param param0 
 * @returns 
 */
const MyButton: React.FC<ButtonProps> = ({ more, disabled, type, label, onClick }) => (
	type === 'submit'
		? <ButtonStyle disabled={disabled} onClick={onClick}>{label}</ButtonStyle>
		: <AppLinkStyle disabled={disabled} onClick={onClick}>{label}</AppLinkStyle>
)


export default MyButton
