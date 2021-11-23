import styled from 'styled-components'
import { Styles } from 'react-modal'

export const ModalContent = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  vertical-align: middle;
  height: 100%;
`
/**
 * Modal shape
 */
export const ModalStyle = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    position: 'absolute',
    top: '0px',
    left: '0px',
    right: '0px',
    bottom: '0px',
    background: '#fff',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius: '4px',
    outline: 'none',
    padding: '20px',
    textAlign: 'center',
  }
} as Styles

/**
 * The style required for simulate a document card
 */
export const loaderStyle = {
	rx: 10,
	ry: 10,
	height: 30,
	margin: 12,
	width: 10,
	config: {
		speed: 2,
		width: 400,
		height: 290,
		viewBox: '0 0 450 200',
		backgroundColor: '#DDDAE7',
		foregroundColor: '#ecebeb',
	},
	fields: [
		{ style: 'rect', x: 12, y: 0, width: 330 },
		{ style: 'rect', x: 12, y: 1, width: 165 },
		{ style: 'rect', x: 12, y: 2, width:110 },
		{ style: 'rect', x: 2,  y: 4, width: 190 },
    { style: 'rect', x: 25, y: 4, width: 195 },
		{ style: 'circle', r: 50 }
	]
}
