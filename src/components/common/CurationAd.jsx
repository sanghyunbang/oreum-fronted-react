import styled from "styled-components";

const Container = styled.div`
    width: 100%;
    margin: 0 auto;
    font-family: 'Noto Sans KR', sans-serif;
`;

const HeaderArea = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0.2rem;
`;

const TitleText = styled.div`
    h3 {
        margin: 0;
        font-size: 0.8rem;
        font-weight:700
    }
    h4 {
        margin:0;
        font-size: 0.65rem;
        font-weight: 400;
        color: grey;
    }
`;

const ViewAll = styled.div`
    h2 {
        font-size: 0.8rem;
        font-weight: 600;
        color: #888;
        cursor: pointer;
    }
`;

const ImageList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
`

const CurationCard = styled.div`
    position: relative;
    height: 100px;
    border-radius: 10px;
    background-color: ${(props) => props.bgColor || `#ddd`};
    color: white;
    padding: 0.8rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    font-weight: bold;
    overflow: hidden;

    border: ${(props)=>(props.highlight ? '2px solid #007bff' : `none`)};
`;



const CurationAd = () => {
    return (
        <Container>
            <HeaderArea>
                <TitleText>
                    <h3>오름의 테마별 큐레이션</h3>
                    <h4>오름이 제안하는 추천코스를 살펴보세요!</h4>
                </TitleText>
                <ViewAll>
                    <h2>전체보기</h2>
                </ViewAll>
            </HeaderArea>

            <ImageList>
                <CurationCard bgColor='#2980b9' highlight>
                     🏞 체력별 난이도↓  
                    <br />
                    알록달록 추천 코스  
                    <br />
                    BEST 8
                </CurationCard>
                <CurationCard bgColor='#2ecc71'>
                    <br />
                    초보 산행 추천 코스  
                    <br />
                    BEST 9                
                </CurationCard>
            </ImageList>
        </Container>
    );
}

export default CurationAd;