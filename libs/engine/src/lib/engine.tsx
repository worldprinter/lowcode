import styled from '@emotion/styled';





/* eslint-disable-next-line */
export interface EngineProps {}

const StyledEngine = styled.div`
    color: pink;
`

export function Engine(props: EngineProps) {
    return (
        <StyledEngine>
            <h1>Welcome to Engine!</h1>
        </StyledEngine>
    )
}

export default Engine
