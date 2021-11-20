import styled from 'styled-components'

interface ToastProps {
  color?: string
  show: string
  //height: number
  //proportion: number
}

export const ToastStyle = styled.div<ToastProps>`
  border-radius: 10px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  box-shadow: 0px 4px 8px ${p => p.color ?? 'red'};
  overflow: hidden;
  color: white;
  background-color: ${p => p.color ?? 'red'};
  width: 120px;
  display: ${p => p.show ? p.show : 'none'}
`