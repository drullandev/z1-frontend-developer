import styled from 'styled-components'

interface ToastProps {
  color?: string
  show: string
  //height: number
  //proportion: number
}

export const NoticeStyle = styled.div<ToastProps>`
  overflow: hidden;
  color: ${p => p.color ?? 'red'};
  display: ${p => p.show ? p.show : 'none'};
  margin: 20px 0px;
`