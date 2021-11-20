import styled from 'styled-components'

interface ToastProps {
  color?: string
  show: string
  //height: number
  //proportion: number
}

export const NoticeStyle = styled.div<ToastProps>`
  border-radius: 38px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  box-shadow: 0px 4px 8px ${p => p.color ?? 'red'};
  overflow: hidden;
  color: ${p => p.color ?? 'red'};
  width: 120px;
  display: ${p => p.show ? p.show : 'none'}

`

/*height:  ${p => p.height+'%'};
max-width: ${p => (p.height ?? 10)/(p.proportion ?? 60)+'%'};*/