
import React from 'react'
import { ButtonStyle, AppLinkStyle } from './styles'
import { ButtonProps } from './types'

const MyButton: React.FC<ButtonProps> = ({ disabled, type, label, onClick }) => (
	type === 'submit'
		? <ButtonStyle disabled={disabled} onClick={onClick}>{label}</ButtonStyle>
		: <AppLinkStyle disabled={disabled} onClick={onClick}>{label}</AppLinkStyle>
)


export default MyButton
