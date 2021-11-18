
import React from 'react'
import { ButtonStyle, AppLinkStyle } from './styles'
import { ButtonProps } from './types'

const MyButton: React.FC<ButtonProps> = ({ type, label, onClick }) => (
	type === 'submit'
		? <ButtonStyle onClick={onClick}>{label}</ButtonStyle>
		: <AppLinkStyle onClick={onClick}>{label}</AppLinkStyle>
)


export default MyButton
