import TopMenu from './TopMenu';
import QuestionCanvas from './QuestionCanvas';
import AnswerPanel from './AnswerPanel';


const styles = {
    sessionBox: {
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgb(223, 216, 204)',
        stroke: '2px solid',
    },
    topBox: {
        width: '100%',
        height: '5vh',
        backgroundImage: 'linear-gradient(to right, rgb(106, 102, 190), rgb(158, 184, 197))',
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
    },
    infoBox: {
        width: '100%',
        height: '15vh',
        backgroundColor: 'rgb(208, 216, 218)',
    },
    mainBox: {
        width: '100%',
        height: 'fit-content',
        backgroundColor: 'rgb(231, 231, 231)',
        display: 'flex',
    },
    questionBox: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '75%',
        height: '100%',
        backgroundColor: 'rgb(139, 100, 100)',
    },
    answerBox: {
        width: '25%',
        height: '100%',
        backgroundColor: 'rgb(144, 169, 193)',
    },
};

function SessionRunner() {
    // Static layout hierarchy
    return (
        <div style={styles.sessionBox}>
            <div style={styles.topBox}>
                <TopMenu />
            </div>
            <div style={styles.infoBox}>

            </div>
            <div style={styles.mainBox}>
                <QuestionCanvas />
                <AnswerPanel />
            </div>
        </div>
    );
}

export default SessionRunner;