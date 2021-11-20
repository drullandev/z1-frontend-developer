import styled from 'styled-components'

interface ToastProps {
  color?: string
  show: string
}

export const NoticeStyle = styled.div<ToastProps>`
  overflow: hidden;
  display: ${p => p.show ? p.show : 'none'};
  margin: 20px 0px;
  font-size: calc(10px + 2vmin);
  cursor: 'arrow';
  color: white;
`