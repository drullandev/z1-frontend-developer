import styled from 'styled-components'

interface ToastProps {
  color?: string
  show: string
  //height: number
  //proportion: number
}

export const ToastStyle = styled.div<ToastProps>`
  border-radius: 4px;
  overflow: hidden;
  color: white;
  background-color: ${p => p.color ?? 'red'};
  width: 120px;
  display: ${p => p.show ? p.show : 'none'};
  padding: 7px;
  margin-left: 33%;
  margin: -14% 0 0 28%;
  z-index: 1;
`