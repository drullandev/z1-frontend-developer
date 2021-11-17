import styled from 'styled-components'

export const AppStyle = styled.html`
  .app {
    text-align: center;
  }
`
export const AppLogo = styled.image`
  .app-logo {
    height: 10vmin;
    pointer-events: none;
  }
`
/*
export const AppLogoExtra = styled.media`
  @media (prefers-reduced-motion: no-preference) {
    .app-logo {
      animation: app-logo-spin infinite 20s linear;
    }
  }
`*/

export const AppHeader = styled.div`
.app-header {
  background-color: #282c34;
  min-height: 10vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}
`

export const AppLink = styled.a`
  .app-link {
    color: #61dafb;
  }
`
/*
export const StyledUl = styled.media`
  @keyframes app-logo-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`
*/