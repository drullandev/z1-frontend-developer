import styled from 'styled-components'
import { ToastProps } from './types'

export const ToastStyle = styled.div<ToastProps>`
  border-radius: 4px;
  overflow: hidden;
  color: white;
  font-size: calc(9px + 1vmin);
  background-color: ${p => p.bgColor ?? 'red'};
  max-width: 180px;
  display: ${p => p.show ? p.show : 'none'};
  padding: 9px;
  margin: -8.6vh -15vw 0 0;
  z-index: 1;
  font-weight: bold;
`